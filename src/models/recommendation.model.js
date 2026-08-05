const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Recommendation = sequelize.define('Recommendation', {
  userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
  type: { type: DataTypes.STRING, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT,
  url: DataTypes.STRING,
  metadata: { type: DataTypes.JSON, defaultValue: {} },
  source: { type: DataTypes.STRING, defaultValue: 'ai' },
  score: DataTypes.INTEGER
}, { tableName: 'recommendations' });

module.exports = Recommendation;
