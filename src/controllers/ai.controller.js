const asyncHandler = require('../middleware/asyncHandler');
const aiService = require('../services/ai/ai.service');
const { success } = require('../utils/apiResponse');

const status = asyncHandler(async (req, res) => {
  success(res, 'AI provider status fetched', {
    defaultProvider: process.env.AI_PROVIDER || 'openai',
    openaiConfigured: Boolean(process.env.OPENAI_API_KEY),
    grokConfigured: Boolean(process.env.GROK_API_KEY)
  });
});

const generate = asyncHandler(async (req, res) => {
  const response = await aiService.generateCompletion(req.body.prompt, { provider: req.body.provider });
  success(res, 'AI completion generated', { provider: response.provider, content: response.content });
});

module.exports = { status, generate };
