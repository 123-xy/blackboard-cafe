import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let ratelimit: Ratelimit | null = null;

function getRatelimit(): Ratelimit | null {
  if (ratelimit) return ratelimit;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  const redis = new Redis({ url, token });
  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 h"),
    prefix: "blackboard-cafe:contact",
  });

  return ratelimit;
}

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

/**
 * 5 submissions/hour/IP. If Upstash isn't configured, rate limiting is
 * skipped (allowed=true) rather than blocking the contact form entirely —
 * consistent with how the rest of this site degrades gracefully when an
 * optional integration's env vars are missing.
 */
export async function checkContactRateLimit(ip: string): Promise<RateLimitResult> {
  const limiter = getRatelimit();
  if (!limiter) {
    return { allowed: true, remaining: 5, resetAt: Date.now() };
  }

  const { success, remaining, reset } = await limiter.limit(ip);
  return { allowed: success, remaining, resetAt: reset };
}
