import { describe, expect, it } from "vitest";
import { FixedWindowRateLimiter } from "./rate-limit";

describe("FixedWindowRateLimiter", () => {
  it("allows requests up to the limit and blocks the next one", () => {
    const limiter = new FixedWindowRateLimiter(2, 1_000);
    const now = 1_000_000;

    expect(limiter.check("workspace:a", now).allowed).toBe(true);
    expect(limiter.check("workspace:a", now).allowed).toBe(true);

    const blocked = limiter.check("workspace:a", now);

    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfterSeconds).toBe(1);
  });

  it("keeps buckets independent", () => {
    const limiter = new FixedWindowRateLimiter(1, 1_000);
    const now = 1_000_000;

    expect(limiter.check("workspace:a", now).allowed).toBe(true);
    expect(limiter.check("workspace:b", now).allowed).toBe(true);
    expect(limiter.check("workspace:a", now).allowed).toBe(false);
  });

  it("resets after the window elapses", () => {
    const limiter = new FixedWindowRateLimiter(1, 1_000);
    const now = 1_000_000;

    expect(limiter.check("ip:1", now).allowed).toBe(true);
    expect(limiter.check("ip:1", now + 1_001).allowed).toBe(true);
  });

  it("prunes expired buckets", () => {
    const limiter = new FixedWindowRateLimiter(1, 1_000);
    const now = 1_000_000;

    limiter.check("ip:1", now);
    limiter.check("ip:2", now);
    limiter.prune(now + 1_001);

    expect(limiter.size).toBe(0);
  });

  it("rejects invalid configuration", () => {
    expect(() => new FixedWindowRateLimiter(0, 1_000)).toThrow();
    expect(() => new FixedWindowRateLimiter(1, 0)).toThrow();
  });
});
