export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
}

interface Bucket {
  count: number;
  resetAt: number;
}

export class FixedWindowRateLimiter {
  private readonly buckets = new Map<string, Bucket>();

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
