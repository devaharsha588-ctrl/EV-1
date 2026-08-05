const router = require('express').Router();
const controller = require('../controllers/chat.controller');
const validators = require('../validators/common.validators');
const validate = require('../middleware/validate.middleware');

router.post('/', validators.chat, validate, controller.send);
router.get('/history', controller.history);

module.exports = router;
