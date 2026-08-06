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

const app = express();

// Security headers
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// CORS Configuration — seamless local dev and production support
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (!env.isProduction) return callback(null, true);
    const allowed = [env.clientUrl, 'http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];
    if (
      allowed.includes(origin) ||
      origin.startsWith('http://localhost:') ||
      origin.startsWith('http://127.0.0.1:') ||
      origin.endsWith('.vercel.app') ||
      origin.includes('vercel.app')
    ) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsers with payload size limits
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser(env.cookieSecret));
app.use(requestLogger);

// Global rate limiting on all /api/* routes
app.use('/api', apiLimiter);

// Root informational endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'EV AI API backend is running',
    version: '1.0.0'
  });
});

app.use('/health', require('./routes/health.routes'));
app.use('/api/v1', requireDatabase, routes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
