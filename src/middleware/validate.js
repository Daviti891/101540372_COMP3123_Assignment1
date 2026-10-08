const { validationResult } = require('express-validator');
const logger = require('../config/logger');

module.exports = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();

    logger.warn('Validation failed', { path: req.path });
    res.status(400).json({
        message: 'Validation failed',
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg }))
    });
};