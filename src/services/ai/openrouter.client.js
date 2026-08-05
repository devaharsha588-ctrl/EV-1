const OpenAI = require('openai');
const env = require('../../config/env');

module.exports = env.ai.openrouterApiKey ? new OpenAI({
  apiKey: env.ai.openrouterApiKey,
  baseURL: env.ai.openrouterBaseUrl || 'https://openrouter.ai/api/v1'
}) : null;
