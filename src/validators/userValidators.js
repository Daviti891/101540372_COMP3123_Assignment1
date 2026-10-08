const { body } = require('express-validator');

exports.signup = [
    body('username').trim().isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 characters'),
    body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
    body('password')
        .isStrongPassword({ minLength: 8 })
        .withMessage('Weak password (8+ chars, upper, lower, number, symbol)')
];

exports.login = [
    body('password').notEmpty().withMessage('Password required'),
    body().custom((b) => {
        if (!b.username && !b.email) throw new Error('username or email required');
        return true;
    })
];