const logger = require('../config/logger');

module.exports = (req, res, next) => {
    res.on('finish', () => {
        logger.info('request', {
            method: req.method,
            path: req.originalUrl.split('?')[0],
            status: res.statusCode
        });
    });
    next();
};