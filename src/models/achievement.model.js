const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Achievement = sequelize.define('Achievement', {
  userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
  title: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT,
  badge: DataTypes.STRING,
  earnedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'earned_at' }
}, { tableName: 'achievements' });

module.exports = Achievement;
