const logger = require('../config/logger');

exports.notFound = (req, res) => {
    res.status(404).json({ message: 'Route not found' });
};

exports.errorHandler = (err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ message: 'Malformed JSON' });
    }
    if (err.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid ID' });
    }
    if (err.code === 11000) {
        return res.status(409).json({ message: 'Username or email already exists' });
    }
    if (err.name === 'ValidationError') {
        return res.status(400).json({ message: err.message });
    }

    logger.error(err.message, { path: req.path });
    res.status(500).json({ message: 'Internal server error' });
};