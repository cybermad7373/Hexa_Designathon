import { describe, expect, it, vi, afterEach } from "vitest";
import { LoadBalancer, createLoadBalancer } from "./load-balancer";
import type { Backend } from "./load-balancer";

afterEach(() => {
  vi.useRealTimers();
});

function makeBackend(id: string, url: string, weight = 1): Backend {
  return {
    id,
    url,
    weight,
    activeRequests: 0,
    totalRequests: 0,
    failedRequests: 0,
    healthy: true,
    lastCheckedAt: null,
    consecutiveFailures: 0,
  };
}

describe("LoadBalancer", () => {
  it("round-robin cycles through healthy backends", () => {
    const lb = new LoadBalancer([makeBackend("a", "http://a"), makeBackend("b", "http://b")], {
      strategy: "round-robin",
    });
    const ids = [lb.select()!.id, lb.select()!.id, lb.select()!.id, lb.select()!.id];
    expect(ids).toEqual(["a", "b", "a", "b"]);
  });

  it("least-connections picks the backend with fewest active requests", () => {
    const lb = new LoadBalancer([makeBackend("a", "http://a"), makeBackend("b", "http://b")], {
      strategy: "least-connections",
    });
    lb.dispatch("a");
    expect(lb.select()!.id).toBe("b");
  });

  it("weighted-round-robin prefers higher weight", () => {
    const lb = new LoadBalancer(
      [makeBackend("a", "http://a", 3), makeBackend("b", "http://b", 1)],
      { strategy: "weighted-round-robin" },
    );
    const picks = Array.from({ length: 4 }, () => lb.select()!.id);
    expect(picks.filter((id) => id === "a").length).toBeGreaterThanOrEqual(2);
  });

  it("excludes unhealthy backends", () => {
    const lb = new LoadBalancer([makeBackend("a", "http://a"), makeBackend("b", "http://b")]);
    lb.setHealth("a", false);
    expect(lb.select()!.id).toBe("b");
  });

  it("returns null when all backends are unhealthy", () => {
    const lb = new LoadBalancer([makeBackend("a", "http://a")]);
    lb.setHealth("a", false);
    expect(lb.select()).toBeNull();
  });

  it("tracks dispatch and completion", () => {
    const lb = new LoadBalancer([makeBackend("a", "http://a")]);
    lb.dispatch("a");
    expect(lb.getStats()[0]!.activeRequests).toBe(1);
    lb.complete("a", true);
    expect(lb.getStats()[0]!.activeRequests).toBe(0);
    expect(lb.getStats()[0]!.totalRequests).toBe(1);
  });

  it("records failures", () => {
    const lb = new LoadBalancer([makeBackend("a", "http://a")]);
    lb.dispatch("a");
    lb.complete("a", false);
    expect(lb.getStats()[0]!.failedRequests).toBe(1);
    expect(lb.getStats()[0]!.successRate).toBe(0);
  });

  it("adds and removes backends", () => {
    const lb = new LoadBalancer([makeBackend("a", "http://a")]);
    expect(lb.select()!.id).toBe("a");
    lb.addBackend(makeBackend("b", "http://b"));
    expect(lb.getStats().length).toBe(2);
    lb.removeBackend("a");
    expect(lb.getStats().length).toBe(1);
    expect(lb.select()!.id).toBe("b");
  });

  it("updates weight dynamically", () => {
    const lb = new LoadBalancer(
      [makeBackend("a", "http://a", 1), makeBackend("b", "http://b", 1)],
      { strategy: "weighted-round-robin" },
    );
    lb.updateWeight("b", 5);
    const picks = Array.from({ length: 6 }, () => lb.select()!.id);
    expect(picks.filter((id) => id === "b").length).toBeGreaterThan(
      picks.filter((id) => id === "a").length,
    );
  });

  it("health check marks backend unhealthy after failure threshold", async () => {
    let calls = 0;
    const check = vi.fn(async () => {
      calls += 1;
      return calls > 2; // fail first two, succeed after
    });
    const lb = new LoadBalancer([makeBackend("a", "http://a")], {
      strategy: "round-robin",
      unhealthyThreshold: 2,
    });
    await lb.checkHealth(check);
    expect(lb.getStats()[0]!.healthy).toBe(true); // one failure, below threshold
    await lb.checkHealth(check);
    expect(lb.getStats()[0]!.healthy).toBe(false); // two consecutive failures
    await lb.checkHealth(check);
    expect(lb.getStats()[0]!.healthy).toBe(true); // success recovers after healthyThreshold=2? needs two
  });

  it("removeBackend returns false for missing", () => {
    const lb = new LoadBalancer([makeBackend("a", "http://a")]);
    expect(lb.removeBackend("missing")).toBe(false);
  });

  it("addBackend throws on duplicate id", () => {
    const lb = new LoadBalancer([makeBackend("a", "http://a")]);
    expect(() => lb.addBackend(makeBackend("a", "http://a2"))).toThrow(/already exists/);
  });

  it("createLoadBalancer factory builds a balancer", () => {
    const lb = createLoadBalancer([makeBackend("a", "http://a")]);
    expect(lb.select()!.id).toBe("a");
  });

  it("startHealthChecks is idempotent and stopHealthChecks clears the timer", async () => {
    vi.useFakeTimers();
    const lb = new LoadBalancer([makeBackend("a", "http://a")], { healthCheckIntervalMs: 100 });
    const check = vi.fn(async () => true);
    lb.startHealthChecks(check);
    lb.startHealthChecks(check); // no-op
    await vi.advanceTimersByTimeAsync(250);
    lb.stopHealthChecks();
    expect(check).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it("health check catch path marks backend unhealthy on exception", async () => {
    const check = vi.fn(async () => {
      throw new Error("probe exploded");
    });
    const lb = new LoadBalancer([makeBackend("a", "http://a")], {
      strategy: "round-robin",
      unhealthyThreshold: 1,
    });
    await lb.checkHealth(check);
    expect(lb.getStats()[0]!.healthy).toBe(false);
  });

  it("setHealth returns false for missing backend", () => {
    const lb = new LoadBalancer([makeBackend("a", "http://a")]);
    expect(lb.setHealth("missing", true)).toBe(false);
  });

  it("dispatch and complete ignore missing backend", () => {
    const lb = new LoadBalancer([makeBackend("a", "http://a")]);
    lb.dispatch("missing");
    lb.complete("missing", true);
    expect(lb.getStats()[0]!.totalRequests).toBe(0);
  });

  it("weighted-round-robin falls back when all weights are zero", () => {
    const lb = new LoadBalancer(
      [makeBackend("a", "http://a", 0), makeBackend("b", "http://b", 0)],
      { strategy: "weighted-round-robin" },
    );
    expect(lb.select()).not.toBeNull();
  });

  it("weighted-round-robin with single backend", () => {
    const lb = new LoadBalancer([makeBackend("a", "http://a", 2)], {
      strategy: "weighted-round-robin",
    });
    expect(lb.select()!.id).toBe("a");
    expect(lb.select()!.id).toBe("a");
  });

  it("health check timeout marks backend unhealthy", async () => {
    vi.useFakeTimers();
    const lb = new LoadBalancer([makeBackend("a", "http://a")], {
      strategy: "round-robin",
      healthCheckTimeoutMs: 50,
      unhealthyThreshold: 1,
    });
    const check = vi.fn(() => new Promise<boolean>(() => undefined));
    const p = lb.checkHealth(check);
    await vi.advanceTimersByTimeAsync(60);
    await p;
    expect(lb.getStats()[0]!.healthy).toBe(false);
    vi.useRealTimers();
  });

  it("health check recovers backend on success", async () => {
    const lb = new LoadBalancer([makeBackend("a", "http://a")], {
      strategy: "round-robin",
      unhealthyThreshold: 1,
    });
    await lb.checkHealth(async () => false);
    expect(lb.getStats()[0]!.healthy).toBe(false);
    await lb.checkHealth(async () => true);
    expect(lb.getStats()[0]!.healthy).toBe(true);
  });

  it("updateWeight returns false for missing", () => {
    const lb = new LoadBalancer([makeBackend("a", "http://a")]);
    expect(lb.updateWeight("missing", 5)).toBe(false);
  });

  it("stopHealthChecks is safe before start", () => {
    const lb = new LoadBalancer([makeBackend("a", "http://a")]);
    expect(() => lb.stopHealthChecks()).not.toThrow();
    expect(lb.select()!.id).toBe("a");
  });

  it("setHealth false preserves accumulated failures", async () => {
    const lb = new LoadBalancer([makeBackend("a", "http://a")], { unhealthyThreshold: 5 });
    await lb.checkHealth(async () => false);
    expect(lb.getStats()[0]!.healthy).toBe(true);
    expect(lb.setHealth("a", false)).toBe(true);
    expect(lb.getStats()[0]!.healthy).toBe(false);
  });

  it("least-connections skips a backend with more active requests", () => {
    const lb = new LoadBalancer([makeBackend("a", "http://a"), makeBackend("b", "http://b")], {
      strategy: "least-connections",
    });
    lb.dispatch("b");
    expect(lb.select()!.id).toBe("a");
  });

  it("factory accepts options", () => {
    const lb = createLoadBalancer([makeBackend("a", "http://a"), makeBackend("b", "http://b")], {
      strategy: "least-connections",
    });
    lb.dispatch("a");
    expect(lb.select()!.id).toBe("b");
  });

  it("health check skips a backend removed during the probe", async () => {
    const lb = new LoadBalancer([makeBackend("a", "http://a")]);
    await lb.checkHealth(async () => {
      lb.removeBackend("a");
      return true;
    });
    expect(lb.getStats()).toEqual([]);
  });
});
