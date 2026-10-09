const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../config/logger');

exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = await User.create({ username, email, password });
        logger.info('User signup', { userId: user.id });
        res.status(201).json({ message: 'User created', user });
    } catch (e) {
        next(e);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = await User.findOne(username ? { username } : { email }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            logger.warn('Login failed');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '1h'
        });
        logger.info('Login success', { userId: user.id });
        res.status(200).json({ message: 'Login successful', token });
    } catch (e) {
        next(e);
    }
};