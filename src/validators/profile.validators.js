const { body } = require('express-validator');
const professions = require('../constants/professions');

const profileFields = [
  body('profession').optional().isIn(professions).withMessage('Profession is not supported'),
  body('skills').optional().isArray().withMessage('Skills must be an array'),
  body('interests').optional().isArray().withMessage('Interests must be an array'),
  body('weeklyHours').optional().isInt({ min: 0, max: 168 }).withMessage('Weekly hours must be between 0 and 168'),
  body('github').optional({ nullable: true }).isString(),
  body('linkedin').optional({ nullable: true }).isString(),
  body('portfolio').optional({ nullable: true }).isString()
];

module.exports = {
  onboarding: [
    body('profession').isIn(professions).withMessage('Profession is required'),
    body('careerGoal').notEmpty().withMessage('Career goal is required'),
    ...profileFields
  ],
  update: profileFields
};
