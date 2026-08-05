const router = require('express').Router();
const controller = require('../controllers/github.controller');
const validators = require('../validators/common.validators');
const validate = require('../middleware/validate.middleware');

router.post('/analyze', validators.github, validate, controller.analyze);
router.get('/history', controller.history);

module.exports = router;
