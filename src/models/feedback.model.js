const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Feedback = sequelize.define('Feedback', {
  userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
  recommendationId: { type: DataTypes.INTEGER, field: 'recommendation_id' },
  aiResponseId: { type: DataTypes.INTEGER, field: 'ai_response_id' },
  type: { type: DataTypes.STRING, allowNull: false },
  rating: DataTypes.INTEGER,
  comment: DataTypes.TEXT,
  metadata: { type: DataTypes.JSON, defaultValue: {} }
}, { tableName: 'feedback' });

module.exports = Feedback;
