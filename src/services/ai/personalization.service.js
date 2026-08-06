const aiService = require('./ai.service');
const { parseJson } = require('../../helpers/json.helper');
const { buildPersonalizationPrompt } = require('../../prompts/personalization.prompt');

const redactPII = (text) => {
  if (typeof text !== 'string' || !text) return text;
  return text
    // Email addresses
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, '[REDACTED_EMAIL]')
    // Phone numbers (US/International standard formats)
    .replace(/\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g, '[REDACTED_PHONE]')
    // SSN / Aadhaar / Govt ID patterns
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[REDACTED_GOVT_ID]')
    .replace(/\b\d{4}\s?\d{4}\s?\d{4}\b/g, '[REDACTED_GOVT_ID]');
};

const estimateTokens = (text) => {
  if (!text) return 0;
  return Math.ceil(String(text).length / 4);
};

const summarizeConversation = async (historyMessages, existingSummary = '') => {
  if (!historyMessages || historyMessages.length === 0) return existingSummary;

  const totalMessageCount = historyMessages.length;
  const historyText = historyMessages.map((m) => `${m.role}: ${m.content}`).join('\n');
  const totalTokens = estimateTokens(historyText);

  if (totalMessageCount < 15 && totalTokens < 2000) {
    return existingSummary;
  }

  const prompt = `Summarize the following career mentoring conversation into 3-4 bullet points highlighting key topics, user progress, decisions, and open questions. Keep concise.\n\nPrior Summary:\n${existingSummary || 'None'}\n\nRecent Messages:\n${historyText}`;

  try {
    const response = await aiService.generateCompletion(prompt, { maxTokens: 400 });
    return response.content || existingSummary;
  } catch (err) {
    return existingSummary;
  }
};

const generatePlan = async (user, context = {}, options = {}) => {
  const sanitizedContext = { ...context };
  if (sanitizedContext.resumeSummary) {
    sanitizedContext.resumeSummary = redactPII(sanitizedContext.resumeSummary);
  }

  const prompt = buildPersonalizationPrompt(user, sanitizedContext);
  const response = await aiService.generateCompletion(prompt, { ...options, responseFormat: { type: 'json_object' } });
  return { provider: response.provider, data: parseJson(response.content, {}) };
};

module.exports = {
  redactPII,
  estimateTokens,
  summarizeConversation,
  generatePlan
};
