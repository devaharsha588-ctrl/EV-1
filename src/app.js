const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const env = require('./config/env');
const { apiLimiter } = require('./middleware/rateLimiter.middleware');
const requestLogger = require('./middleware/requestLogger.middleware');
const { notFound, errorHandler } = require('./middleware/error.middleware');
const routes = require('./routes');
const { requireDatabase } = require('./middleware/database.middleware');
const { getDatabaseHealth } = require('./services/database.service');

const app = express();

app.use(helmet());
app.use(cors({
  origin: env.clientUrl,
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(env.cookieSecret));
app.use(requestLogger);
app.use('/api', apiLimiter);

app.use('/health', require('./routes/health.routes'));

app.use('/api/v1', requireDatabase, routes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
