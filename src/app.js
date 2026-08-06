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

// Security headers — strict production config
app.use(helmet({
  contentSecurityPolicy: env.isProduction ? undefined : false,
  crossOriginEmbedderPolicy: false
}));

// CORS — only allow explicitly listed origins (reject all others in production)
const allowedOrigins = [
  env.clientUrl,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow same-origin (no origin header) and server-to-server in development
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // Reject unknown origins — do NOT silently allow them
    callback(new Error(`CORS policy: origin ${origin} is not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsers with payload size limits
app.use(express.json({ limit: '512kb' }));           // Reduced from 1mb — reject oversized JSON
app.use(express.urlencoded({ extended: true, limit: '256kb' }));
app.use(cookieParser(env.cookieSecret));
app.use(requestLogger);

// Global rate limiting on all /api/* routes
app.use('/api', apiLimiter);

// Root informational endpoint (no secrets exposed)
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'EV AI API is running',
    version: '1.0.0'
  });
});

app.use('/health', require('./routes/health.routes'));
app.use('/api/v1', requireDatabase, routes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
