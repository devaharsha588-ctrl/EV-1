const OpenAI = require('openai');
const env = require('../../config/env');

module.exports = env.ai.openaiApiKey ? new OpenAI({ apiKey: env.ai.openaiApiKey }) : null;
