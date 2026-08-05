const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Project = sequelize.define('Project', {
  userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
  title: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT,
  repoUrl: { type: DataTypes.STRING, field: 'repo_url' },
  liveUrl: { type: DataTypes.STRING, field: 'live_url' },
  techStack: { type: DataTypes.JSON, defaultValue: [], field: 'tech_stack' },
  status: { type: DataTypes.STRING, defaultValue: 'planned' }
}, { tableName: 'projects' });

module.exports = Project;
