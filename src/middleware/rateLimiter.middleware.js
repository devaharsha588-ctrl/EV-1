const rateLimit = require('express-rate-limit');

// General API limiter — all /api/* routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later', errors: [] }
});

// Strict auth limiter — max 5 attempts per 15 minutes on all auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  message: { success: false, message: 'Too many authentication attempts. Please wait 15 minutes and try again.', errors: [] }
});

// Password reset limiter — extra tight, 3 per hour
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many password reset attempts. Please try again in 1 hour.', errors: [] }
});

// AI chat endpoint limiter — 30 per 15 minutes per IP
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many AI chat requests, please slow down and try again later.', errors: [] }
});

module.exports = { apiLimiter, authLimiter, passwordResetLimiter, chatLimiter };

