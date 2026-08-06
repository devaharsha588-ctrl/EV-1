const { getDatabaseHealth } = require('../services/database.service');

const requireDatabase = (req, res, next) => {
  const health = getDatabaseHealth();
  
  // Allow AI Chat, AI generation, and Health check routes even in degraded (no-MySQL) mode
  const isAiRoute = req.path.startsWith('/chat') || req.path.startsWith('/ai') || req.path.startsWith('/health');
  if (isAiRoute) {
    return next();
  }

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
