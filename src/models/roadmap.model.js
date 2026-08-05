const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Roadmap = sequelize.define('Roadmap', {
  userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
  title: { type: DataTypes.STRING, allowNull: false },
  profession: DataTypes.STRING,
  status: { type: DataTypes.ENUM('active', 'completed', 'archived'), defaultValue: 'active' },
  milestones: { type: DataTypes.JSON, defaultValue: [] },
  aiProvider: { type: DataTypes.STRING, field: 'ai_provider' }
}, { tableName: 'roadmaps' });

module.exports = Roadmap;
