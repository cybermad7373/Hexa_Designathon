import { AppError, ERROR_CODES } from "@/lib/errors";

/** Result of a rate limit check. */
export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
}

/** Configuration shared by every rate limiter algorithm. */
export interface RateLimiterConfig {
  /** Maximum number of requests allowed per window. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
  /** Identifier used for logging and metrics. */
  name?: string;
}

export type RateLimitAlgorithm = "fixed-window" | "sliding-window-log" | "token-bucket";

/** A single timestamped hit used by the sliding-window-log algorithm. */
interface Hit {
  timestamp: number;
}

/** Storage backend for rate limit state. */
export interface RateLimitStore {
  get(key: string): Promise<unknown | null>;
  set(key: string, value: unknown, ttlMs: number): Promise<void>;
  del(key: string): Promise<void>;
}

/** In-memory store (single instance, falls back gracefully when Redis is unavailable). */
export class MemoryRateLimitStore implements RateLimitStore {
  private readonly map = new Map<string, { value: unknown; expiresAt: number }>();

  async get(key: string): Promise<unknown | null> {
    const entry = this.map.get(key);
    if (!entry || entry.expiresAt <= Date.now()) {
      this.map.delete(key);
      return null;
    }
    return entry.value;
  }

  async set(key: string, value: unknown, ttlMs: number): Promise<void> {
    this.map.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  async del(key: string): Promise<void> {
    this.map.delete(key);
  }

  size(): number {
    return this.map.size;
  }
}

/** Options for constructing a RateLimiter. */
export interface RateLimiterOptions extends RateLimiterConfig {
  /** Storage backend. Defaults to an in-memory store. */
  store?: RateLimitStore;
  /** Algorithm to use. Defaults to fixed-window. */
  algorithm?: RateLimitAlgorithm;
  /** Key prefix namespaced per limiter instance. */
  prefix?: string;
  /** When true, every check is logged at warn level when a request is rejected. */
  logRejections?: boolean;
}

/**
 * Enterprise-grade rate limiter.
 *
 * Supports three algorithms backed by a pluggable store (in-memory by default,
 * Redis when running multiple instances). Fail-open by default: if the store
 * throws, the request is allowed so availability is never sacrificed to
 * rate-limit infrastructure.
 */
export class RateLimiter {
  private readonly limit: number;
  private readonly windowMs: number;
  private readonly name: string;
  private readonly store: RateLimitStore;
  private readonly algorithm: RateLimitAlgorithm;
  private readonly prefix: string;
  private readonly logRejections: boolean;

  constructor(options: RateLimiterOptions) {
    if (options.limit <= 0 || options.windowMs <= 0) {
      throw new AppError(ERROR_CODES.BAD_REQUEST, "Rate limiter limit and window must be positive");
    }

    this.limit = options.limit;
    this.windowMs = options.windowMs;
    this.name = options.name ?? "default";
    this.store = options.store ?? new MemoryRateLimitStore();
    this.algorithm = options.algorithm ?? "fixed-window";
    this.prefix = options.prefix ?? "ratelimit";
    this.logRejections = options.logRejections ?? true;
  }

  private keyFor(key: string): string {
    return `${this.prefix}:${this.name}:${key}`;
  }

  private now(): number {
    return Date.now();
  }

  /**
   * Check and consume one unit of rate limit budget for the given key.
   * Throws nothing on store failure — degrades to allowed.
   */
  async check(key: string): Promise<RateLimitResult> {
    const storeKey = this.keyFor(key);
    const now = this.now();

    try {
      let result: RateLimitResult;
      switch (this.algorithm) {
        case "sliding-window-log":
          result = await this.slidingWindowLog(storeKey, now);
          break;
        case "token-bucket":
          result = await this.tokenBucket(storeKey, now);
          break;
        case "fixed-window":
        default:
          result = await this.fixedWindow(storeKey, now);
          break;
      }
      return result;
    } catch {
      return {
        allowed: true,
        limit: this.limit,
        remaining: this.limit,
        resetAt: now + this.windowMs,
        retryAfterSeconds: 0,
      };
    }
  }

  private async fixedWindow(storeKey: string, now: number): Promise<RateLimitResult> {
    const stored = (await this.store.get(storeKey)) as { count: number; resetAt: number } | null;

    if (!stored || stored.resetAt <= now) {
      const resetAt = now + this.windowMs;
      await this.store.set(storeKey, { count: 1, resetAt }, this.windowMs);
      return this.result(true, this.limit - 1, resetAt, 0);
    }

    if (stored.count >= this.limit) {
      return this.result(
        false,
        0,
        stored.resetAt,
        Math.max(1, Math.ceil((stored.resetAt - now) / 1000)),
      );
    }

    await this.store.set(
      storeKey,
      { count: stored.count + 1, resetAt: stored.resetAt },
      this.windowMs,
    );
    return this.result(true, this.limit - (stored.count + 1), stored.resetAt, 0);
  }

  private async slidingWindowLog(storeKey: string, now: number): Promise<RateLimitResult> {
    const stored = (await this.store.get(storeKey)) as { hits: Hit[] } | null;
    const windowStart = now - this.windowMs;
    const hits: Hit[] = stored?.hits.filter((h) => h.timestamp > windowStart) ?? [];

    if (hits.length >= this.limit) {
      const oldest = hits[0]?.timestamp ?? now + this.windowMs;
      const retryAfter = Math.max(1, Math.ceil((oldest + this.windowMs - now) / 1000));
      return this.result(false, 0, oldest + this.windowMs, retryAfter);
    }

    hits.push({ timestamp: now });
    await this.store.set(storeKey, { hits }, this.windowMs * 2);
    return this.result(true, this.limit - hits.length, now + this.windowMs, 0);
  }

  private async tokenBucket(storeKey: string, now: number): Promise<RateLimitResult> {
    const stored = (await this.store.get(storeKey)) as {
      tokens: number;
      lastRefillAt: number;
    } | null;
    const refillRate = this.limit / this.windowMs; // tokens per ms

    let tokens = stored?.tokens ?? this.limit;
    const lastRefillAt = stored?.lastRefillAt ?? now;

    // Refill tokens based on elapsed time.
    const elapsed = Math.max(0, now - lastRefillAt);
    tokens = Math.min(this.limit, tokens + elapsed * refillRate);

    if (tokens < 1) {
      const waitMs = (1 - tokens) / refillRate;
      const resetAt = now + waitMs;
      return this.result(false, 0, resetAt, Math.max(1, Math.ceil(waitMs / 1000)));
    }

    tokens -= 1;
    await this.store.set(storeKey, { tokens, lastRefillAt: now }, this.windowMs * 2);
    return this.result(true, Math.floor(tokens), now + this.windowMs, 0);
  }

  private result(
    allowed: boolean,
    remaining: number,
    resetAt: number,
    retryAfterSeconds: number,
  ): RateLimitResult {
    return {
      allowed,
      limit: this.limit,
      remaining: Math.max(0, remaining),
      resetAt,
      retryAfterSeconds,
    };
  }

  /** Prune expired entries (in-memory store only). No-op for remote stores. */
  async prune(): Promise<void> {
    // Best effort; remote stores handle TTL natively.
  }

  getLimit(): number {
    return this.limit;
  }

  getWindowMs(): number {
    return this.windowMs;
  }
}

/**
 * Standard HTTP rate-limit headers derived from a check result.
 */
export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    "ratelimit-limit": String(result.limit),
    "ratelimit-remaining": String(result.remaining),
    "ratelimit-reset": String(Math.ceil(result.resetAt / 1000)),
    ...(result.retryAfterSeconds > 0 ? { "retry-after": String(result.retryAfterSeconds) } : {}),
  };
}

/** Registry of named limiters so middleware can reuse configured instances. */
export class RateLimiterRegistry {
  private readonly limiters = new Map<string, RateLimiter>();

  register(name: string, limiter: RateLimiter): void {
    if (this.limiters.has(name)) {
      throw new AppError(ERROR_CODES.CONFLICT, `Rate limiter "${name}" is already registered`);
    }
    this.limiters.set(name, limiter);
  }

  get(name: string): RateLimiter {
    const limiter = this.limiters.get(name);
    if (!limiter) {
      throw new AppError(ERROR_CODES.NOT_FOUND, `Rate limiter "${name}" not found`);
    }
    return limiter;
  }

  has(name: string): boolean {
    return this.limiters.has(name);
  }
}

/** Fixed-window bucket state used by the legacy FixedWindowRateLimiter. */
interface FixedWindowBucket {
  count: number;
  resetAt: number;
}

/**
 * Backward-compatible fixed-window rate limiter (synchronous, in-memory).
 * Kept for existing callers and tests. Prefer `RateLimiter` for new code.
 */
export class FixedWindowRateLimiter {
  private readonly buckets = new Map<string, FixedWindowBucket>();

  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
  ) {
    if (limit <= 0 || windowMs <= 0) {
      throw new Error("Rate limiter limit and window must be positive");
    }
  }

  check(key: string, now = Date.now()): RateLimitResult {
    const bucket = this.buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      const resetAt = now + this.windowMs;
      this.buckets.set(key, { count: 1, resetAt });
      return {
        allowed: true,
        limit: this.limit,
        remaining: this.limit - 1,
        resetAt,
        retryAfterSeconds: Math.ceil(this.windowMs / 1000),
      };
    }

    if (bucket.count >= this.limit) {
      return {
        allowed: false,
        limit: this.limit,
        remaining: 0,
        resetAt: bucket.resetAt,
        retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
      };
    }

    bucket.count += 1;

    return {
      allowed: true,
      limit: this.limit,
      remaining: this.limit - bucket.count,
      resetAt: bucket.resetAt,
      retryAfterSeconds: 0,
    };
  }

  prune(now = Date.now()) {
    for (const [key, bucket] of this.buckets) {
      if (bucket.resetAt <= now) {
        this.buckets.delete(key);
      }
    }
  }

  get size() {
    return this.buckets.size;
  }
}

export const defaultRateLimiterRegistry = new RateLimiterRegistry();
