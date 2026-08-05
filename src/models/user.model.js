const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const professions = require('../constants/professions');

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
  password: { type: DataTypes.STRING, allowNull: false },
  avatar: DataTypes.STRING,
  college: DataTypes.STRING,
  degree: DataTypes.STRING,
  branch: DataTypes.STRING,
  year: DataTypes.STRING,
  profession: DataTypes.ENUM(...professions),
  experienceLevel: { type: DataTypes.STRING, field: 'experience_level' },
  skills: { type: DataTypes.JSON, defaultValue: [] },
  interests: { type: DataTypes.JSON, defaultValue: [] },
  learningStyle: { type: DataTypes.STRING, field: 'learning_style' },
  weeklyHours: { type: DataTypes.INTEGER, field: 'weekly_hours' },
  targetCompany: { type: DataTypes.STRING, field: 'target_company' },
  careerGoal: { type: DataTypes.TEXT, field: 'career_goal' },
  dreamRole: { type: DataTypes.STRING, field: 'dream_role' },
  github: DataTypes.STRING,
  linkedin: DataTypes.STRING,
  portfolio: DataTypes.STRING,
  resumeUrl: { type: DataTypes.STRING, field: 'resume_url' },
  bio: DataTypes.TEXT,
  onboardingComplete: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'onboarding_complete' },
  resetPasswordToken: { type: DataTypes.STRING, field: 'reset_password_token' },
  resetPasswordExpires: { type: DataTypes.DATE, field: 'reset_password_expires' }
}, {
  tableName: 'users',
  defaultScope: {
    attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] }
  }
});

module.exports = User;
