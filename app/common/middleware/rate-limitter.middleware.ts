import rateLimit from "express-rate-limit";

/**
 * Basic rate limiter middleware configuration for Express.
 * 
 * This middleware limits the number of requests an IP can make to the server in a given time window.
 * If the limit is exceeded, the user will receive a structured response indicating that they have made too many requests.
 * 
 * Configuration:
 * - Limits requests to 100 per 15 minutes per IP.
 * - Sends a custom error message when the limit is exceeded.
 * - Includes relevant headers to indicate rate-limiting status.
 * 
 * @constant {Object} rateLimiter - The rate limiting middleware to be used in the Express app.
 * 
 * @returns {void} - This is a middleware function that doesn't return any values, but it affects the request lifecycle by limiting requests.
 */
export const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        status: "error",
        message: "Too many requests from this IP. Please try again after 15 minutes.",
    },
    headers: true, // Sends X-RateLimit headers
    standardHeaders: true, // Include rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers (deprecated)
    handler: (req, res) => {
        res.status(429).json({
            status: "error",
            message: "Too many requests from this IP. Please try again after 15 minutes.",
        });
    },
});
