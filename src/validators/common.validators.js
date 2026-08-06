const { body, param } = require('express-validator');

// Field length constants — reject oversized payloads at the field level
const MAX_MESSAGE_LEN = 8000;
const MAX_TEXT_LEN = 1000;
const MAX_SHORT_STR = 255;

module.exports = {
  chat: [
    body('message')
      .trim()
      .notEmpty().withMessage('Message is required')
      .isLength({ max: MAX_MESSAGE_LEN }).withMessage(`Message must not exceed ${MAX_MESSAGE_LEN} characters`)
      .escape(),
    body('provider')
      .optional()
      .isIn(['openai', 'grok', 'gemini', 'openrouter']).withMessage('Invalid AI provider'),
    body('conversationId')
      .optional({ nullable: true })
      .isString()
      .isLength({ max: 128 }).withMessage('Invalid conversationId')
      .trim()
  ],

  optionalRefreshToken: [
    body('refreshToken')
      .optional()
      .isString().withMessage('Refresh token must be a string')
      .isLength({ max: 2048 }).withMessage('Refresh token too long')
  ],

  taskCreate: [
    body('title')
      .trim()
      .notEmpty().withMessage('Title is required')
      .isLength({ max: MAX_SHORT_STR }).withMessage('Title too long')
      .escape(),
    body('description')
      .optional({ nullable: true })
      .isString()
      .isLength({ max: MAX_TEXT_LEN }).withMessage('Description too long')
      .trim()
      .escape(),
    body('estimatedHours').optional().isFloat({ min: 0, max: 10000 }),
    body('hoursSpent').optional().isFloat({ min: 0, max: 10000 }),
    body('progress').optional().isInt({ min: 0, max: 100 })
  ],

  taskUpdate: [
    param('id').isInt().withMessage('Task id must be numeric'),
    body('hoursSpent')
      .optional()
      .isFloat({ min: 0, max: 10000 }).withMessage('Hours spent must be zero or greater'),
    body('progress').optional().isInt({ min: 0, max: 100 })
  ],

  recommendationId: [
    param('recommendationId').isInt().withMessage('Recommendation id must be numeric')
  ],

  rateAi: [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment')
      .optional()
      .isString()
      .isLength({ max: 2000 }).withMessage('Comment too long')
      .trim()
      .escape()
  ],

  feedback: [
    body('type')
      .trim()
      .notEmpty().withMessage('Feedback type is required')
      .isLength({ max: 100 }).withMessage('Type too long')
      .escape(),
    body('rating').optional().isInt({ min: 1, max: 5 }),
    body('comment')
      .optional()
      .isString()
      .isLength({ max: 2000 }).withMessage('Comment too long')
      .trim()
      .escape()
  ],

  github: [
    body('username')
      .trim()
      .notEmpty().withMessage('GitHub username is required')
      .isLength({ max: 100 }).withMessage('Username too long')
      .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Invalid GitHub username format')
  ],

  notificationId: [
    param('id').isInt().withMessage('Notification id must be numeric')
  ],

  userUpdate: [
    body('name')
      .optional()
      .trim()
      .notEmpty().withMessage('Name cannot be empty')
      .isLength({ max: MAX_SHORT_STR }).withMessage('Name too long')
      .escape(),
    body('avatar')
      .optional({ nullable: true })
      .isURL().withMessage('Avatar must be a valid URL'),
    body('college')
      .optional({ nullable: true })
      .isString()
      .isLength({ max: MAX_SHORT_STR })
      .trim().escape(),
    body('degree')
      .optional({ nullable: true })
      .isString()
      .isLength({ max: MAX_SHORT_STR })
      .trim().escape(),
    body('branch')
      .optional({ nullable: true })
      .isString()
      .isLength({ max: MAX_SHORT_STR })
      .trim().escape(),
    body('year')
      .optional({ nullable: true })
      .isString()
      .isLength({ max: 20 })
      .trim().escape(),
    body('github')
      .optional({ nullable: true })
      .isURL().withMessage('GitHub must be a valid URL'),
    body('linkedin')
      .optional({ nullable: true })
      .isURL().withMessage('LinkedIn must be a valid URL'),
    body('portfolio')
      .optional({ nullable: true })
      .isURL().withMessage('Portfolio must be a valid URL'),
    body('bio')
      .optional({ nullable: true })
      .isString()
      .isLength({ max: 2000 }).withMessage('Bio too long')
      .trim()
      .escape()
  ]
};
