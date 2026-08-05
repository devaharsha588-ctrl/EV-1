const { body, param } = require('express-validator');

module.exports = {
  chat: [
    body('message').trim().notEmpty().withMessage('Message is required'),
    body('provider').optional().isIn(['openai', 'grok']).withMessage('Provider must be openai or grok')
  ],
  optionalRefreshToken: [body('refreshToken').optional().isString().withMessage('Refresh token must be a string')],
  taskCreate: [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('estimatedHours').optional().isFloat({ min: 0 }),
    body('hoursSpent').optional().isFloat({ min: 0 }),
    body('progress').optional().isInt({ min: 0, max: 100 })
  ],
  taskUpdate: [
    param('id').isInt().withMessage('Task id must be numeric'),
    body('hoursSpent').optional().isFloat({ min: 0 }).withMessage('Hours spent must be zero or greater')
  ],
  recommendationId: [param('recommendationId').isInt().withMessage('Recommendation id must be numeric')],
  rateAi: [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().isString()
  ],
  feedback: [
    body('type').trim().notEmpty().withMessage('Feedback type is required'),
    body('rating').optional().isInt({ min: 1, max: 5 })
  ],
  github: [body('username').trim().notEmpty().withMessage('GitHub username is required')],
  notificationId: [param('id').isInt().withMessage('Notification id must be numeric')],
  userUpdate: [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('avatar').optional({ nullable: true }).isString(),
    body('college').optional({ nullable: true }).isString(),
    body('degree').optional({ nullable: true }).isString(),
    body('branch').optional({ nullable: true }).isString(),
    body('year').optional({ nullable: true }).isString(),
    body('github').optional({ nullable: true }).isString(),
    body('linkedin').optional({ nullable: true }).isString(),
    body('portfolio').optional({ nullable: true }).isString(),
    body('bio').optional({ nullable: true }).isString()
  ]
};
