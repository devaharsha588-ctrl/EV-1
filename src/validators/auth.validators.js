const { body } = require('express-validator');

const MAX_PASSWORD_LEN = 128;

const passwordRule = body('password')
  .isLength({ min: 8, max: MAX_PASSWORD_LEN })
  .withMessage('Password must be 8–128 characters')
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number');

module.exports = {
  register: [
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required')
      .isLength({ max: 255 }).withMessage('Name too long')
      .escape(),
    body('email')
      .isEmail().withMessage('Valid email is required')
      .normalizeEmail()
      .isLength({ max: 255 }).withMessage('Email too long'),
    passwordRule
  ],
  login: [
    body('email')
      .isEmail().withMessage('Valid email is required')
      .normalizeEmail()
      .isLength({ max: 255 }).withMessage('Email too long'),
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ max: MAX_PASSWORD_LEN }).withMessage('Password too long')
  ],
  forgotPassword: [
    body('email')
      .isEmail().withMessage('Valid email is required')
      .normalizeEmail()
      .isLength({ max: 255 }).withMessage('Email too long')
  ],
  resetPassword: [
    body('token')
      .notEmpty().withMessage('Reset token is required')
      .isLength({ max: 512 }).withMessage('Invalid token format'),
    passwordRule
  ],
  changePassword: [
    body('currentPassword')
      .notEmpty().withMessage('Current password is required')
      .isLength({ max: MAX_PASSWORD_LEN }).withMessage('Password too long'),
    body('newPassword')
      .isLength({ min: 8, max: MAX_PASSWORD_LEN })
      .withMessage('New password must be 8–128 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number')
  ]
};
