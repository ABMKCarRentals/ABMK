const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");

// Rate limiting middleware
const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100) => {
  return rateLimit({
    windowMs, // 15 minutes by default
    max, // limit each IP to max requests per windowMs
    message: {
      success: false,
      message: "Too many requests from this IP, please try again later.",
      retryAfter: Math.ceil(windowMs / 1000),
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message: "Too many requests, please slow down.",
        retryAfter: Math.ceil(windowMs / 1000),
      });
    },
  });
};

// Speed limiting middleware (gradually slow down repeated requests)
const createSpeedLimiter = (windowMs = 15 * 60 * 1000, delayAfter = 5) => {
  return slowDown({
    windowMs,
    delayAfter, // allow delayAfter requests per windowMs without delay
    delayMs: 500, // add 500ms of delay per request after delayAfter
    maxDelayMs: 20000, // max delay of 20 seconds
  });
};

// Different rate limits for different endpoints
const generalLimiter = createRateLimiter(15 * 60 * 1000, 100); // 100 requests per 15 minutes
const searchLimiter = createRateLimiter(1 * 60 * 1000, 30); // 30 requests per minute for search
const detailsLimiter = createRateLimiter(1 * 60 * 1000, 60); // 60 requests per minute for details

const speedLimiter = createSpeedLimiter(15 * 60 * 1000, 10);

module.exports = {
  generalLimiter,
  searchLimiter,
  detailsLimiter,
  speedLimiter,
  createRateLimiter,
  createSpeedLimiter,
};
