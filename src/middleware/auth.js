const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

module.exports = (req, res, next) => {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
        logger.warn('Auth failed: missing or malformed token', { path: req.path });
        return res.status(401).json({ message: 'Missing or malformed token' });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: payload.sub };
        next();
    } catch (err) {
        const msg = err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
        logger.warn('Auth failed: ' + msg, { path: req.path });
        res.status(401).json({ message: msg });
    }
};