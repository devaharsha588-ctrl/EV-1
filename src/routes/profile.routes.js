const router = require('express').Router();
const controller = require('../controllers/profile.controller');
const validators = require('../validators/profile.validators');
const validate = require('../middleware/validate.middleware');

router.post('/onboarding', validators.onboarding, validate, controller.onboarding);
router.get('/', controller.getProfile);
router.put('/', validators.update, validate, controller.updateProfile);

module.exports = router;
