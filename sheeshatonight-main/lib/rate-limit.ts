/**
 * In-Memory Rate Limiting with Sliding Window Counter Algorithm
 * 
 * Rate limits:
 * - Login: 5 attempts per 15 minutes
 * - Registration: 10 attempts per hour
 * - General API: 100 requests per minute
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store for rate limiting
// Key format: "type:ip" e.g., "login:192.168.1.1"
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Extract client IP address from request headers
 * Supports various proxy headers
 */
export function extractIpAddress(headers: Headers): string {
  // Check common proxy headers
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    // Get the first IP in the list (original client)
    const ips = forwardedFor.split(',');
    if (ips.length > 0 && ips[0]) {
      return ips[0].trim();
    }
  }

  const realIp = headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }

  const cfConnectingIp = headers.get('cf-connecting-ip');
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }

  // Fallback to unknown
  return 'unknown';
}

/**
 * Check if rate limit is exceeded
 * Uses sliding window counter algorithm
 * 
 * @param identifier - Unique identifier (usually IP address)
 * @param limitType - Type of rate limit (login, register, api)
 * @param maxAttempts - Maximum allowed attempts
 * @param windowMs - Time window in milliseconds
 * @returns Object with success status and remaining attempts
 */
export function checkRateLimit(
  identifier: string,
  limitType: 'login' | 'register' | 'api',
  maxAttempts: number,
  windowMs: number
): { success: boolean; remaining: number; resetAt: number } {
  const key = `${limitType}:${identifier}`;
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  // No existing entry or expired - allow request
  if (!entry || entry.resetAt < now) {
    const resetAt = now + windowMs;
    rateLimitStore.set(key, { count: 1, resetAt });
    return {
      success: true,
      remaining: maxAttempts - 1,
      resetAt,
    };
  }

  // Entry exists and not expired - check count
  if (entry.count >= maxAttempts) {
    return {
      success: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  // Increment count
  entry.count += 1;
  rateLimitStore.set(key, entry);

  return {
    success: true,
    remaining: maxAttempts - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * Increment rate limit counter
 * Used after a failed attempt (e.g., failed login)
 * 
 * @param identifier - Unique identifier (usually IP address)
 * @param limitType - Type of rate limit
 * @param windowMs - Time window in milliseconds
 */
export function incrementRateLimit(
  identifier: string,
  limitType: 'login' | 'register' | 'api',
  windowMs: number
): void {
  const key = `${limitType}:${identifier}`;
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetAt < now) {
    // Create new entry
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
  } else {
    // Increment existing entry
    entry.count += 1;
    rateLimitStore.set(key, entry);
  }
}

/**
 * Reset rate limit for a specific identifier and type
 * Useful for manual override or testing
 * 
 * @param identifier - Unique identifier
 * @param limitType - Type of rate limit
 */
export function resetRateLimit(
  identifier: string,
  limitType: 'login' | 'register' | 'api'
): void {
  const key = `${limitType}:${identifier}`;
  rateLimitStore.delete(key);
}

/**
 * Get current rate limit status
 * 
 * @param identifier - Unique identifier
 * @param limitType - Type of rate limit
 * @returns Current count and reset time, or null if no entry exists
 */
export function getRateLimitStatus(
  identifier: string,
  limitType: 'login' | 'register' | 'api'
): { count: number; resetAt: number } | null {
  const key = `${limitType}:${identifier}`;
  const entry = rateLimitStore.get(key);

  if (!entry) {
    return null;
  }

  const now = Date.now();
  if (entry.resetAt < now) {
    rateLimitStore.delete(key);
    return null;
  }

  return {
    count: entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * Clear all rate limit entries
 * Useful for testing or maintenance
 */
export function clearAllRateLimits(): void {
  rateLimitStore.clear();
}

/**
 * Get total number of active rate limit entries
 * Useful for monitoring memory usage
 */
export function getRateLimitStoreSize(): number {
  return rateLimitStore.size;
}

// Predefined rate limit configurations
export const RATE_LIMITS = {
  LOGIN: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  REGISTER: {
    maxAttempts: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  API: {
    maxAttempts: 100,
    windowMs: 60 * 1000, // 1 minute
  },
} as const;
