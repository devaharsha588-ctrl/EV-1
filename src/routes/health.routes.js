const router = require('express').Router();
const { getDatabaseHealth } = require('../services/database.service');
const { verifySupabaseConnection } = require('../services/supabase.service');
const env = require('../config/env');

router.get('/', async (req, res) => {
  const database = getDatabaseHealth();
  const supabase = await verifySupabaseConnection();
  const activeAiProvider = env.ai.provider || 'gemini';

  const isHealthy = database.connected || supabase.connected;

  res.status(isHealthy ? 200 : 503).json({
    success: isHealthy,
    message: isHealthy ? 'EV AI API is operational' : 'EV AI API is running in degraded mode',
    data: {
      status: isHealthy ? 'healthy' : 'degraded',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database,
      supabase: {
        configured: Boolean(env.supabase.url),
        connected: supabase.connected
      },
      ai: {
        provider: activeAiProvider,
        geminiConfigured: Boolean(env.ai.geminiApiKey || process.env.GEMINI_API_KEY),
        openaiConfigured: Boolean(env.ai.openaiApiKey),
        grokConfigured: Boolean(env.ai.grokApiKey),
        openrouterConfigured: Boolean(env.ai.openrouterApiKey)
      }
    }
  });
});

module.exports = router;
