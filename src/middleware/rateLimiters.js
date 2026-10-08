const rateLimit = require('express-rate-limit');

const handler = (req, res) =>
    res.status(429).json({ message: 'Too many requests, try again later' });

exports.authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, handler });
exports.apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, handler });