const { body } = require('express-validator');
const professions = require('../constants/professions');

const profileFields = [
  body('profession')
    .optional()
    .isIn(professions).withMessage('Profession is not supported'),
  body('skills')
    .optional()
    .isArray({ max: 100 }).withMessage('Skills must be an array of at most 100 items'),
  body('skills.*')
    .optional()
    .isString()
    .isLength({ max: 100 }).withMessage('Each skill must be at most 100 characters')
    .trim()
    .escape(),
  body('interests')
    .optional()
    .isArray({ max: 50 }).withMessage('Interests must be an array of at most 50 items'),
  body('interests.*')
    .optional()
    .isString()
    .isLength({ max: 100 }).withMessage('Each interest must be at most 100 characters')
    .trim()
    .escape(),
  body('weeklyHours')
    .optional()
    .isInt({ min: 0, max: 168 }).withMessage('Weekly hours must be between 0 and 168'),
  body('careerGoal')
    .optional({ nullable: true })
    .isString()
    .isLength({ max: 2000 }).withMessage('Career goal too long')
    .trim()
    .escape(),
  body('dreamRole')
    .optional({ nullable: true })
    .isString()
    .isLength({ max: 255 }).withMessage('Dream role too long')
    .trim()
    .escape(),
  body('targetCompany')
    .optional({ nullable: true })
    .isString()
    .isLength({ max: 255 }).withMessage('Target company too long')
    .trim()
    .escape(),
  body('learningStyle')
    .optional({ nullable: true })
    .isString()
    .isLength({ max: 100 })
    .trim()
    .escape(),
  body('github')
    .optional({ nullable: true })
    .isURL().withMessage('GitHub must be a valid URL'),
  body('linkedin')
    .optional({ nullable: true })
    .isURL().withMessage('LinkedIn must be a valid URL'),
  body('portfolio')
    .optional({ nullable: true })
    .isURL().withMessage('Portfolio must be a valid URL')
];

module.exports = {
  onboarding: [
    body('profession')
      .isIn(professions).withMessage('Profession is required'),
    body('careerGoal')
      .notEmpty().withMessage('Career goal is required')
      .isLength({ max: 2000 }).withMessage('Career goal too long')
      .trim()
      .escape(),
    ...profileFields
  ],
  update: profileFields
};
