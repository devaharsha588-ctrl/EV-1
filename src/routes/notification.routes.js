const router = require('express').Router();
const controller = require('../controllers/notification.controller');
const validators = require('../validators/common.validators');
const validate = require('../middleware/validate.middleware');

router.get('/notifications', controller.notifications);
router.put('/notifications/:id/read', validators.notificationId, validate, controller.markRead);
router.get('/achievements', controller.achievements);

module.exports = router;
