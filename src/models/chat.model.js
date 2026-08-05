const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Chat = sequelize.define('Chat', {
  userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
  role: { type: DataTypes.ENUM('user', 'assistant', 'system'), allowNull: false },
  content: { type: DataTypes.TEXT('long'), allowNull: false },
  aiProvider: { type: DataTypes.STRING, field: 'ai_provider' },
  metadata: { type: DataTypes.JSON, defaultValue: {} }
}, { tableName: 'chats' });

module.exports = Chat;
