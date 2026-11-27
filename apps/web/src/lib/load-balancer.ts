export interface Backend {
  id: string;
  url: string;
  weight: number;
  activeRequests: number;
  totalRequests: number;
  failedRequests: number;
  healthy: boolean;
  lastCheckedAt: number | null;
  consecutiveFailures: number;
}

export interface BackendStats {
  id: string;
  url: string;
  healthy: boolean;
  activeRequests: number;
  totalRequests: number;
  failedRequests: number;
  successRate: number;
}

export type LBStrategy = "round-robin" | "least-connections" | "weighted-round-robin";

export interface LoadBalancerOptions {
  strategy?: LBStrategy;
  healthCheckIntervalMs?: number;
  healthCheckTimeoutMs?: number;
  unhealthyThreshold?: number; // consecutive failures before marking unhealthy
  healthyThreshold?: number; // consecutive successes before marking healthy
  stickySessions?: boolean;
}

const DEFAULT_OPTIONS: Required<LoadBalancerOptions> = {
  strategy: "round-robin",
  healthCheckIntervalMs: 30_000,
  healthCheckTimeoutMs: 5_000,
  unhealthyThreshold: 3,
  healthyThreshold: 2,
  stickySessions: false,
};

/**
 * Enterprise-grade load balancer.
 *
 * Maintains a pool of backends, performs active health checks, supports
 * round-robin / least-connections / weighted-round-robin selection, tracks
 * in-flight requests for least-connections, and excludes unhealthy backends.
 * All state is in-memory; for multi-instance deploys, backends and health
 * state should be synchronized via Redis (documented in SCALABILITY.md).
 */
export class LoadBalancer {
  private readonly backends = new Map<string, Backend>();
  private readonly order: string[] = [];
  private readonly options: Required<LoadBalancerOptions>;
  private rrIndex = 0;
  private wrrCurrentWeight = 0;
  private wrrIndex = 0;
  private healthCheckTimer: ReturnType<typeof setInterval> | null = null;
  private started = false;

  constructor(backends: readonly Backend[], options: LoadBalancerOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };

    for (const backend of backends) {
      this.addBackend(backend);
    }
  }

  /** Add a backend to the pool. */
  addBackend(backend: Backend): void {
    if (this.backends.has(backend.id)) {
      throw new Error(`Backend "${backend.id}" already exists`);
    }
    this.backends.set(backend.id, { ...backend, activeRequests: 0 });
    this.order.push(backend.id);
  }

  /** Remove a backend from the pool. */
  removeBackend(id: string): boolean {
    const exists = this.backends.delete(id);
    if (exists) {
      this.order.splice(this.order.indexOf(id), 1);
      this.resetIndexes();
    }
    return exists;
  }

  /** Update backend weight dynamically. */
  updateWeight(id: string, weight: number): boolean {
    const backend = this.backends.get(id);
    if (!backend) return false;
    backend.weight = Math.max(0, weight);
    return true;
  }

  /** Mark a backend healthy or unhealthy manually. */
  setHealth(id: string, healthy: boolean): boolean {
    const backend = this.backends.get(id);
    if (!backend) return false;
    backend.healthy = healthy;
    backend.consecutiveFailures = healthy ? 0 : backend.consecutiveFailures;
    backend.lastCheckedAt = Date.now();
    return true;
  }

  /** Select a backend using the configured strategy. Returns null if none healthy. */
  select(): Backend | null {
    const healthy = this.order.map((id) => this.backends.get(id)!).filter((b) => b.healthy);

    if (healthy.length === 0) {
      return null;
    }

    switch (this.options.strategy) {
      case "least-connections":
        return this.selectLeastConnections(healthy);
      case "weighted-round-robin":
        return this.selectWeightedRoundRobin(healthy);
      case "round-robin":
      default:
        return this.selectRoundRobin(healthy);
    }
  }

  /** Record that a request was dispatched to a backend (increments active count). */
  dispatch(backendId: string): void {
    const backend = this.backends.get(backendId);
    if (!backend) return;
    backend.activeRequests += 1;
    backend.totalRequests += 1;
  }

  /** Record that a request completed. */
  complete(backendId: string, success: boolean): void {
    const backend = this.backends.get(backendId);
    if (!backend) return;
    backend.activeRequests = Math.max(0, backend.activeRequests - 1);
    if (!success) {
      backend.failedRequests += 1;
    }
  }

  /** Get stats for all backends. */
  getStats(): BackendStats[] {
    return this.order.map((id) => {
      const b = this.backends.get(id)!;
      const successRate =
        b.totalRequests === 0 ? 1 : (b.totalRequests - b.failedRequests) / b.totalRequests;
      return {
        id: b.id,
        url: b.url,
        healthy: b.healthy,
        activeRequests: b.activeRequests,
        totalRequests: b.totalRequests,
        failedRequests: b.failedRequests,
        successRate,
      };
    });
  }

  /** Start periodic health checks (no-op if already started). */
  startHealthChecks(check: (url: string) => Promise<boolean>): void {
    if (this.started) return;
    this.started = true;
    this.checkHealth(check);
    this.healthCheckTimer = setInterval(
      () => this.checkHealth(check),
      this.options.healthCheckIntervalMs,
    );
  }

  /** Stop periodic health checks. */
  stopHealthChecks(): void {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
      this.healthCheckTimer = null;
    }
    this.started = false;
  }

  /** Run one health check cycle across all backends (public for ops/on-demand checks). */
  async checkHealth(check: (url: string) => Promise<boolean>): Promise<void> {
    const now = Date.now();
    const results = await Promise.all(
      this.order.map(async (id) => {
        const backend = this.backends.get(id)!;
        let ok = false;
        try {
          ok = await Promise.race([
            check(backend.url),
            new Promise<boolean>((_, reject) =>
              setTimeout(
                () => reject(new Error("health check timeout")),
                this.options.healthCheckTimeoutMs,
              ),
            ),
          ]);
        } catch {
          ok = false;
        }
        return { id, healthy: ok };
      }),
    );

    for (const { id, healthy } of results) {
      const backend = this.backends.get(id);
      if (!backend) continue;

      if (healthy) {
        backend.consecutiveFailures = 0;
        backend.healthy = true;
      } else {
        backend.consecutiveFailures += 1;
        if (backend.consecutiveFailures >= this.options.unhealthyThreshold) {
          backend.healthy = false;
        }
      }
      backend.lastCheckedAt = now;
    }
  }

  private selectRoundRobin(healthy: Backend[]): Backend | null {
    const backend = healthy[this.rrIndex % healthy.length]!;
    this.rrIndex = (this.rrIndex + 1) % healthy.length;
    return backend;
  }

  private selectLeastConnections(healthy: Backend[]): Backend | null {
    let best: Backend | null = null;
    for (const backend of healthy) {
      if (!best || backend.activeRequests < best.activeRequests) {
        best = backend;
      }
    }
    return best;
  }

  private selectWeightedRoundRobin(healthy: Backend[]): Backend | null {
    const maxWeight = Math.max(...healthy.map((b) => b.weight));
    if (maxWeight === 0) return healthy[0] ?? null;

    while (true) {
      this.wrrIndex = (this.wrrIndex + 1) % healthy.length;
      if (this.wrrIndex === 0) {
        this.wrrCurrentWeight -= 1;
        if (this.wrrCurrentWeight <= 0) {
          this.wrrCurrentWeight = maxWeight;
        }
      }
      const backend = healthy[this.wrrIndex]!;
      if (backend.weight >= this.wrrCurrentWeight) {
        return backend;
      }
    }
  }

  private resetIndexes(): void {
    this.rrIndex = 0;
    this.wrrIndex = 0;
    this.wrrCurrentWeight = 0;
  }
}

export function createLoadBalancer(
  backends: readonly Backend[],
  options?: LoadBalancerOptions,
): LoadBalancer {
  return new LoadBalancer(backends, options);
}

export default LoadBalancer;
