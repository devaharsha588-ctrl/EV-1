const sequelize = require('../config/db');
const env = require('../config/env');
const logger = require('../utils/logger');

const state = {
  connected: false,
  checkedAt: null,
  error: null
};

const friendlyDbError = (error) => {
  const code = error?.parent?.code || error?.original?.code || error?.code;
  if (code === 'ECONNREFUSED') {
    return `MySQL refused the connection at ${env.db.host}:${env.db.port}. Start MySQL or update DB_HOST/DB_PORT in .env.`;
  }
  if (code === 'ER_BAD_DB_ERROR') {
    return `Database "${env.db.name}" does not exist. Create it, then run npm run db:migrate.`;
  }
  if (code === 'ER_ACCESS_DENIED_ERROR') {
    return `MySQL rejected DB_USER/DB_PASSWORD for "${env.db.user}". Check .env credentials.`;
  }
  return error.message || 'Database connection failed';
};

const connectDatabase = async ({ retries = 1, retryDelayMs = 1000 } = {}) => {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      await sequelize.authenticate();
      state.connected = true;
      state.checkedAt = new Date().toISOString();
      state.error = null;
      logger.info('Database connection established');
      return state;
    } catch (error) {
      lastError = error;
      state.connected = false;
      state.checkedAt = new Date().toISOString();
      state.error = friendlyDbError(error);
      logger.warn('Database connection attempt failed', { attempt, message: state.error });
      if (attempt < retries) await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
    }
  }

  throw Object.assign(lastError, { friendlyMessage: state.error });
};

const getDatabaseHealth = () => ({ ...state });

module.exports = { connectDatabase, getDatabaseHealth, friendlyDbError };
