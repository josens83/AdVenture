import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiter (for production, use Redis with @upstash/ratelimit)
interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const key in store) {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  }
}, 5 * 60 * 1000);

interface RateLimitOptions {
  windowMs?: number; // Time window in milliseconds
  maxRequests?: number; // Max requests per window
  message?: string;
  skipSuccessfulRequests?: boolean;
  keyGenerator?: (request: NextRequest) => string;
}

const defaultOptions: Required<RateLimitOptions> = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 60, // 60 requests per minute
  message: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
  skipSuccessfulRequests: false,
  keyGenerator: (request) => {
    // Get client IP from various headers
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwarded?.split(',')[0] || realIp || 'anonymous';
    return ip;
  },
};

export function rateLimit(options: RateLimitOptions = {}) {
  const opts = { ...defaultOptions, ...options };

  return async function rateLimiter(request: NextRequest): Promise<NextResponse | null> {
    const key = opts.keyGenerator(request);
    const now = Date.now();

    // Initialize or reset if window expired
    if (!store[key] || store[key].resetTime < now) {
      store[key] = {
        count: 0,
        resetTime: now + opts.windowMs,
      };
    }

    store[key].count++;

    // Check if rate limit exceeded
    if (store[key].count > opts.maxRequests) {
      const retryAfter = Math.ceil((store[key].resetTime - now) / 1000);

      return NextResponse.json(
        { error: opts.message },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
            'X-RateLimit-Limit': String(opts.maxRequests),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil(store[key].resetTime / 1000)),
          },
        }
      );
    }

    return null; // Request allowed
  };
}

// Pre-configured rate limiters for different endpoints
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 attempts per 15 minutes
  message: '로그인 시도가 너무 많습니다. 15분 후 다시 시도해주세요.',
});

export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // 100 requests per minute
});

export const strictRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 10, // 10 requests per hour
  message: '이 작업은 시간당 10회만 수행할 수 있습니다.',
});

// Upstash Redis rate limiter (for production)
// Note: Requires UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN env vars
export async function createRedisRateLimiter() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.warn('Upstash Redis not configured, using in-memory rate limiting');
    return null;
  }

  try {
    const { Ratelimit } = await import('@upstash/ratelimit');
    const { Redis } = await import('@upstash/redis');

    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    return new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, '1 m'),
      analytics: true,
    });
  } catch {
    console.warn('Failed to initialize Redis rate limiter');
    return null;
  }
}

// Helper to apply rate limiting to API routes
export async function withRateLimit(
  request: NextRequest,
  limiter: (request: NextRequest) => Promise<NextResponse | null>
): Promise<NextResponse | null> {
  return limiter(request);
}
