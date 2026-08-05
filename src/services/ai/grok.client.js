const OpenAI = require('openai');
const env = require('../../config/env');

module.exports = env.ai.grokApiKey ? new OpenAI({
  apiKey: env.ai.grokApiKey,
  baseURL: env.ai.grokBaseUrl
}) : null;
