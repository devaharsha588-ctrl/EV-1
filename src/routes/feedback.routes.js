const router = require('express').Router();
const controller = require('../controllers/feedback.controller');
const validators = require('../validators/common.validators');
const validate = require('../middleware/validate.middleware');

router.post('/like/:recommendationId', validators.recommendationId, validate, controller.like);
router.post('/dislike/:recommendationId', validators.recommendationId, validate, controller.dislike);
router.post('/rate-ai-response', validators.rateAi, validate, controller.rateAiResponse);
router.post('/', validators.feedback, validate, controller.create);

module.exports = router;
