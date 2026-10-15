const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const requestLogger = require('./middleware/requestLogger');
const { apiLimiter } = require('./middleware/rateLimiters');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.set('trust proxy', 1);
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(requestLogger);

app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        next(err);
    }
});

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

app.use('/api/v1', apiLimiter);
app.use('/api/v1/user', require('./routes/userRoutes'));
app.use('/api/v1/emp', require('./routes/empRoutes'));

app.use(notFound);
app.use(errorHandler);

module.exports = app;