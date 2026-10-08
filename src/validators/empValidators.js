const { body, param, query } = require('express-validator');

const fields = [
    body('first_name').trim().notEmpty().withMessage('First name required').isLength({ max: 50 }),
    body('last_name').trim().notEmpty().withMessage('Last name required').isLength({ max: 50 }),
    body('email').isEmail().withMessage('Invalid email'),
    body('position').trim().notEmpty().withMessage('Position required'),
    body('department').trim().notEmpty().withMessage('Department required'),
    body('salary').isFloat({ gt: 0 }).withMessage('Salary must be a positive number'),
    body('date_of_joining').isISO8601().withMessage('Invalid date')
];

exports.create = fields;
exports.update = [param('eid').isMongoId().withMessage('Invalid employee ID'), ...fields];
exports.getOne = [param('eid').isMongoId().withMessage('Invalid employee ID')];
exports.remove = [query('eid').isMongoId().withMessage('Invalid employee ID')];