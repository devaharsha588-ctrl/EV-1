const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const GithubAnalysis = sequelize.define('GithubAnalysis', {
  userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
  username: { type: DataTypes.STRING, allowNull: false },
  score: DataTypes.INTEGER,
  repoSummary: { type: DataTypes.JSON, defaultValue: {}, field: 'repo_summary' },
  suggestions: { type: DataTypes.JSON, defaultValue: [] },
  recommendedProjects: { type: DataTypes.JSON, defaultValue: [], field: 'recommended_projects' },
  aiProvider: { type: DataTypes.STRING, field: 'ai_provider' }
}, { tableName: 'github_analysis' });

module.exports = GithubAnalysis;
