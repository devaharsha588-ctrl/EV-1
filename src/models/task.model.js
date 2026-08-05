const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const LearningHistory = sequelize.define('LearningHistory', {
  userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
  roadmapId: { type: DataTypes.INTEGER, field: 'roadmap_id' },
  title: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT,
  category: DataTypes.STRING,
  skill: DataTypes.STRING,
  estimatedHours: { type: DataTypes.FLOAT, defaultValue: 0, field: 'estimated_hours' },
  hoursSpent: { type: DataTypes.FLOAT, defaultValue: 0, field: 'hours_spent' },
  progress: { type: DataTypes.INTEGER, defaultValue: 0 },
  completed: { type: DataTypes.BOOLEAN, defaultValue: false },
  completedAt: { type: DataTypes.DATE, field: 'completed_at' },
  dueDate: { type: DataTypes.DATE, field: 'due_date' }
}, { tableName: 'learning_history' });

module.exports = LearningHistory;
