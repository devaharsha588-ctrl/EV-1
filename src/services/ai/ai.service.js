const geminiClient = require('./gemini.client');
const openaiClient = require('./openai.client');
const grokClient = require('./grok.client');
const openrouterClient = require('./openrouter.client');
const env = require('../../config/env');
const logger = require('../../utils/logger');
const AppError = require('../../utils/AppError');
const { PROMPT_VERSION } = require('../../prompts/personalization.prompt');

const clients = {
  openai: { client: openaiClient, model: env.ai.openaiModel || 'gpt-4o-mini', maxContextTokens: 128000 },
  grok: { client: grokClient, model: env.ai.grokModel || 'grok-4', maxContextTokens: 131072 },
  gemini: { client: geminiClient, model: env.ai.geminiModel || 'gemini-1.5-flash', maxContextTokens: 1000000 },
  openrouter: { client: openrouterClient, model: env.ai.openrouterModel || 'anthropic/claude-3-opus', maxContextTokens: 200000 }
};


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
    promptVersion: options.promptVersion || PROMPT_VERSION,
    usage: response.usage || null
  });

  return {
    provider,
    promptVersion: options.promptVersion || PROMPT_VERSION,
    content: response.choices?.[0]?.message?.content || '',
    usage: response.usage || null
  };
};

const generateCompletion = async (prompt, options = {}) => {
  const availableProviders = Object.keys(clients).filter((p) => Boolean(clients[p].client));
  if (availableProviders.length === 0) {
    throw new AppError('No AI provider is configured. Set GEMINI_API_KEY, OPENAI_API_KEY, GROK_API_KEY, or OPENROUTER_API_KEY in .env.', 503);
  }

  const preferred = options.provider || env.ai.provider || 'openai';
  const order = [preferred, ...availableProviders.filter((p) => p !== preferred)];

  let lastError;
  for (const provider of order) {
    if (!clients[provider]?.client) continue;
    try {
      if (provider !== preferred) {
        logger.warn('AI provider failed, attempting fallback', { preferred, fallback: provider, message: lastError?.message });
      }
      return await callProvider(provider, prompt, options);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
};

module.exports = { generateCompletion, clients };
