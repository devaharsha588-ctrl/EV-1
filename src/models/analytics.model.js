const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Analytics = sequelize.define('Analytics', {
  userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
  type: { type: DataTypes.STRING, allowNull: false },
  periodStart: { type: DataTypes.DATEONLY, field: 'period_start' },
  periodEnd: { type: DataTypes.DATEONLY, field: 'period_end' },
  data: { type: DataTypes.JSON, defaultValue: {} }
}, { tableName: 'analytics' });

module.exports = Analytics;
