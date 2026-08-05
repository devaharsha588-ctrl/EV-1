const { getDatabaseHealth } = require('../services/database.service');

const requireDatabase = (req, res, next) => {
  const health = getDatabaseHealth();
  if (!health.connected) {
    return res.status(503).json({
      success: false,
      message: 'Database unavailable',
      errors: [health.error || 'Database has not connected yet']
    });
  }
  next();
};

module.exports = { requireDatabase };
