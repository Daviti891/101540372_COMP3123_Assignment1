const router = require('express').Router();
const controller = require('../controllers/userController');
const v = require('../validators/userValidators');
const validate = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiters');

router.post('/signup', authLimiter, v.signup, validate, controller.signup);
router.post('/login', authLimiter, v.login, validate, controller.login);

module.exports = router;