const router = require('express').Router();
const controller = require('../controllers/auth.controller');
const validators = require('../validators/auth.validators');
const validate = require('../middleware/validate.middleware');
const { authenticate } = require('../middleware/auth.middleware');
const { authLimiter, passwordResetLimiter } = require('../middleware/rateLimiter.middleware');
const commonValidators = require('../validators/common.validators');

// Auth-sensitive routes — max 5 per 15 minutes
router.post('/register', authLimiter, validators.register, validate, controller.register);
router.post('/login', authLimiter, validators.login, validate, controller.login);
router.post('/logout', commonValidators.optionalRefreshToken, validate, controller.logout);
router.post('/refresh', authLimiter, commonValidators.optionalRefreshToken, validate, controller.refresh);

// Password routes — extra strict (3 per hour for reset)
router.post('/forgot-password', passwordResetLimiter, validators.forgotPassword, validate, controller.forgotPassword);
router.post('/reset-password', passwordResetLimiter, validators.resetPassword, validate, controller.resetPassword);

router.get('/me', authenticate, controller.me);
router.put('/change-password', authenticate, authLimiter, validators.changePassword, validate, controller.changePassword);

module.exports = router;
