const aiService = require('./ai.service');
const { parseJson } = require('../../helpers/json.helper');
const { buildPersonalizationPrompt } = require('../../prompts/personalization.prompt');

const generatePlan = async (user, context = {}, options = {}) => {
  const prompt = buildPersonalizationPrompt(user, context);
  const response = await aiService.generateCompletion(prompt, { ...options, responseFormat: { type: 'json_object' } });
  return { provider: response.provider, data: parseJson(response.content, {}) };
};

module.exports = { generatePlan };
