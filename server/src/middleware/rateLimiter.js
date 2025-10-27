import WhitelistedIP from '../models/WhitelistedIP.js';

// In-memory store for rate limiting (IP -> { count, resetTime })
// For production, use Redis for distributed rate limiting
const rateLimitStore = new Map();

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 5;

/**
 * Rate limiting middleware for AI generation endpoints
 * - Allows whitelisted IPs unlimited requests
 * - Limits non-whitelisted IPs to 5 requests per hour
 */
export default async function rateLimiter(req, res, next) {
  try {
    // Get client IP (handles proxies/load balancers)
    const clientIP = 
      req.headers['x-forwarded-for']?.split(',')[0].trim() ||
      req.headers['x-real-ip'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress;

    if (!clientIP) {
      return res.status(400).json({ error: 'Unable to determine client IP' });
    }

    // Check if IP is whitelisted
    const whitelisted = await WhitelistedIP.findOne({ ip: clientIP });
    if (whitelisted) {
      return next(); // Whitelisted IPs bypass rate limiting
    }

    // Check rate limit for non-whitelisted IPs
    const now = Date.now();
    const ipData = rateLimitStore.get(clientIP);

    if (!ipData || now > ipData.resetTime) {
      // First request or window expired, reset counter
      rateLimitStore.set(clientIP, {
        count: 1,
        resetTime: now + RATE_LIMIT_WINDOW_MS
      });
      return next();
    }

    if (ipData.count >= MAX_REQUESTS_PER_WINDOW) {
      // Rate limit exceeded
      const resetIn = Math.ceil((ipData.resetTime - now) / 1000 / 60); // minutes
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: `Maximum ${MAX_REQUESTS_PER_WINDOW} requests per hour allowed. Please try again in ${resetIn} minutes.`,
        retryAfter: resetIn
      });
    }

    // Increment counter
    ipData.count += 1;
    rateLimitStore.set(clientIP, ipData);
    
    next();
  } catch (err) {
    console.error('Rate limiter error:', err);
    // Fail open (allow request) rather than blocking on errors
    next();
  }
}

// Cleanup expired entries periodically to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitStore.entries()) {
    if (now > data.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}, 10 * 60 * 1000); // Every 10 minutes
