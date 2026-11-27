import { describe, expect, it } from "vitest";
import {
  RateLimiter,
  rateLimitHeaders,
  RateLimiterRegistry,
  MemoryRateLimitStore,
} from "./rate-limit";
import type { RateLimitStore } from "./rate-limit";

describe("RateLimiter (enterprise)", () => {
  it("fixed-window allows up to limit then blocks", async () => {
    const limiter = new RateLimiter({ limit: 2, windowMs: 1_000, algorithm: "fixed-window" });
    expect((await limiter.check("a")).allowed).toBe(true);
    expect((await limiter.check("a")).allowed).toBe(true);
    const blocked = await limiter.check("a");
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("sliding-window-log blocks sustained rate", async () => {
    const limiter = new RateLimiter({ limit: 3, windowMs: 1_000, algorithm: "sliding-window-log" });
    expect((await limiter.check("a")).allowed).toBe(true);
    expect((await limiter.check("a")).allowed).toBe(true);
    expect((await limiter.check("a")).allowed).toBe(true);
    const blocked = await limiter.check("a");
    expect(blocked.allowed).toBe(false);
  });

  it("token bucket blocks when bucket is empty", async () => {
    const limiter = new RateLimiter({ limit: 1, windowMs: 1_000, algorithm: "token-bucket" });
    expect((await limiter.check("a")).allowed).toBe(true);
    const blocked = await limiter.check("a");
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("keys are independent", async () => {
    const limiter = new RateLimiter({ limit: 1, windowMs: 1_000 });
    expect((await limiter.check("a")).allowed).toBe(true);
    expect((await limiter.check("b")).allowed).toBe(true);
    expect((await limiter.check("a")).allowed).toBe(false);
  });

  it("fails open when the store throws", async () => {
    const throwingStore: RateLimitStore = {
      get: async () => {
        throw new Error("store down");
      },
      set: async () => {
        throw new Error("store down");
      },
      del: async () => {
        throw new Error("store down");
      },
    };

    const limiter = new RateLimiter({
      limit: 1,
      windowMs: 1_000,
      store: throwingStore,
    });
    const result = await limiter.check("a");
    expect(result.allowed).toBe(true);
  });

  it("rateLimitHeaders returns standard headers", () => {
    const headers = rateLimitHeaders({
      allowed: true,
      limit: 10,
      remaining: 7,
      resetAt: 1_000_000,
      retryAfterSeconds: 0,
    });
    expect(headers["ratelimit-limit"]).toBe("10");
    expect(headers["ratelimit-remaining"]).toBe("7");
    expect(headers["ratelimit-reset"]).toBe("1000");
    expect(headers["retry-after"]).toBeUndefined();

    const blockedHeaders = rateLimitHeaders({
      allowed: false,
      limit: 10,
      remaining: 0,
      resetAt: 2_000_000,
      retryAfterSeconds: 42,
    });
    expect(blockedHeaders["retry-after"]).toBe("42");
  });

  it("registry registers and retrieves limiters", () => {
    const registry = new RateLimiterRegistry();
    const limiter = new RateLimiter({ limit: 5, windowMs: 1_000 });
    registry.register("api", limiter);
    expect(registry.has("api")).toBe(true);
    expect(registry.get("api")).toBe(limiter);
    expect(() => registry.get("missing")).toThrow();
    expect(() => registry.register("api", limiter)).toThrow();
  });

  it("rejects invalid configuration", () => {
    expect(() => new RateLimiter({ limit: 0, windowMs: 1_000 })).toThrow();
    expect(() => new RateLimiter({ limit: 1, windowMs: 0 })).toThrow();
  });

  it("exposes limit and window and supports prune", async () => {
    const limiter = new RateLimiter({ limit: 7, windowMs: 500 });
    expect(limiter.getLimit()).toBe(7);
    expect(limiter.getWindowMs()).toBe(500);
    await limiter.prune();
  });

  it("in-memory store tracks size", async () => {
    const store = new MemoryRateLimitStore();
    await store.set("k", "v", 1_000);
    expect(store.size()).toBe(1);
    const got = await store.get("k");
    expect(got).toBe("v");
    await store.del("k");
    expect(await store.get("k")).toBeNull();
  });
});
