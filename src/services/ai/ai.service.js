const openaiClient = require('./openai.client');
const grokClient = require('./grok.client');
const env = require('../../config/env');
const logger = require('../../utils/logger');
const AppError = require('../../utils/AppError');

const clients = {
  openai: { client: openaiClient, model: process.env.OPENAI_MODEL || 'gpt-4o-mini' },
  grok: { client: grokClient, model: process.env.GROK_MODEL || 'grok-4' }
};

const otherProvider = (provider) => (provider === 'openai' ? 'grok' : 'openai');

const callProvider = async (provider, prompt, options = {}) => {
  const entry = clients[provider];
  if (!entry || !entry.client) throw new AppError(`${provider} client is not configured`, 503);

  const response = await entry.client.chat.completions.create({
    model: options.model || entry.model,
    messages: options.messages || [{ role: 'user', content: prompt }],
    temperature: options.temperature ?? 0.4,
    max_tokens: options.maxTokens || 1200,
    response_format: options.responseFormat
  });

  logger.info('AI provider served response', {
    provider,
    usage: response.usage || null
  });

  return {
    provider,
    content: response.choices?.[0]?.message?.content || '',
    usage: response.usage || null
  };
};

const generateCompletion = async (prompt, options = {}) => {
  const preferred = options.provider || env.ai.provider || 'openai';
  if (!clients.openai.client && !clients.grok.client) {
    throw new AppError('No AI provider is configured. Set OPENAI_API_KEY or GROK_API_KEY in .env.', 503);
  }
  try {
    return await callProvider(preferred, prompt, options);
  } catch (error) {
    const fallback = otherProvider(preferred);
    if (!clients[fallback]?.client) throw error;
    logger.warn('AI provider failed, attempting fallback', { preferred, fallback, message: error.message });
    return callProvider(fallback, prompt, options);
  }
};

module.exports = { generateCompletion };
