const app = require('./app');
const env = require('./config/env');
const logger = require('./utils/logger');
const { validateEnv } = require('./config/env.validation');
const { connectDatabase } = require('./services/database.service');
require('./models');

let server;

const shutdown = (signal) => {
  logger.info(`${signal} received, shutting down`);
  if (server) {
    server.close(() => process.exit(0));
    return;
  }
  process.exit(0);
};

const start = async () => {
  const envResult = validateEnv();
  envResult.warnings.forEach((warning) => logger.warn(warning));
  if (!envResult.valid) {
    envResult.errors.forEach((error) => logger.error(`[ENV Warning]: ${error}`));
  }

  try {
    await connectDatabase({ retries: 2, retryDelayMs: 1500 });
  } catch (error) {
    logger.error(error.friendlyMessage || 'Failed to connect database');
    logger.warn('Starting server in degraded mode. AI Chat and API routes remain active.');
  }

  server = app.listen(env.port, () => logger.info(`EV AI API listening on port ${env.port}`));
};

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', error);
  process.exit(1);
});

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

start();
