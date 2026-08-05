const router = require('express').Router();
const { body } = require('express-validator');
const controller = require('../controllers/ai.controller');
const validate = require('../middleware/validate.middleware');

router.get('/status', controller.status);
router.post(
  '/generate',
  [
    body('prompt').trim().notEmpty().withMessage('Prompt is required'),
    body('provider').optional().isIn(['openai', 'grok']).withMessage('Provider must be openai or grok')
  ],
  validate,
  controller.generate
);

module.exports = router;
