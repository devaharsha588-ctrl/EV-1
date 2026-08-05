const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ResumeAnalysis = sequelize.define('ResumeAnalysis', {
  userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
  fileUrl: { type: DataTypes.STRING, allowNull: false, field: 'file_url' },
  score: DataTypes.INTEGER,
  strengths: { type: DataTypes.JSON, defaultValue: [] },
  weaknesses: { type: DataTypes.JSON, defaultValue: [] },
  atsSuggestions: { type: DataTypes.JSON, defaultValue: [], field: 'ats_suggestions' },
  missingSkills: { type: DataTypes.JSON, defaultValue: [], field: 'missing_skills' },
  projectsToAdd: { type: DataTypes.JSON, defaultValue: [], field: 'projects_to_add' },
  certifications: { type: DataTypes.JSON, defaultValue: [] },
  aiProvider: { type: DataTypes.STRING, field: 'ai_provider' }
}, { tableName: 'resume_analysis' });

module.exports = ResumeAnalysis;
