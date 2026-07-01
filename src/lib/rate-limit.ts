/**
 * In-memory rate limiter for serverless functions.
 * Limits requests per IP within a sliding window.
 *
 * NOTE: Resets on cold starts. For production scale,
 * upgrade to Vercel KV or Upstash Redis.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

const DEFAULT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const DEFAULT_MAX_REQUESTS = 5;

/**
 * Check if the request is rate-limited.
 * Returns { limited: true, retryAfterMs } if blocked.
 */
export function checkRateLimit(
  ip: string,
  maxRequests = DEFAULT_MAX_REQUESTS,
  windowMs = DEFAULT_WINDOW_MS
): { limited: boolean; retryAfterMs?: number; remaining: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return { limited: false, remaining: maxRequests - 1 };
  }

  if (entry.count >= maxRequests) {
    return {
      limited: true,
      retryAfterMs: entry.resetAt - now,
      remaining: 0,
    };
  }

  entry.count += 1;
  return { limited: false, remaining: maxRequests - entry.count };
}

/**
 * Extract client IP from request headers (Vercel provides x-forwarded-for).
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}
