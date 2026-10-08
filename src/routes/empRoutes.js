const router = require('express').Router();
const controller = require('../controllers/empController');
const v = require('../validators/empValidators');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/employees', controller.list);
router.post('/employees', v.create, validate, controller.create);
router.get('/employees/:eid', v.getOne, validate, controller.getOne);
router.put('/employees/:eid', v.update, validate, controller.update);
router.delete('/employees', v.remove, validate, controller.remove);

module.exports = router;