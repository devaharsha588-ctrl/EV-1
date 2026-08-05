const router = require('express').Router();
const controller = require('../controllers/user.controller');
const validators = require('../validators/common.validators');
const validate = require('../middleware/validate.middleware');

router.get('/me', controller.me);
router.put('/me', validators.userUpdate, validate, controller.updateMe);

module.exports = router;
