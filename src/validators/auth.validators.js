const { body } = require('express-validator');

const passwordRule = body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters');

module.exports = {
  register: [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    passwordRule
  ],
  login: [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  forgotPassword: [body('email').isEmail().normalizeEmail().withMessage('Valid email is required')],
  resetPassword: [
    body('token').notEmpty().withMessage('Reset token is required'),
    passwordRule
  ],
  changePassword: [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
  ]
};
