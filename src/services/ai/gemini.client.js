const axios = require('axios');
const env = require('../../config/env');
const logger = require('../../utils/logger');
const AppError = require('../../utils/AppError');

const createGeminiClient = () => {
  const apiKey = env.ai?.geminiApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  return {
    chat: {
      completions: {
        create: async ({ model, messages, temperature, max_tokens, response_format }) => {
          const geminiModel = model || env.ai?.geminiModel || process.env.GEMINI_MODEL || 'gemini-1.5-flash';
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;

          // Format messages into Gemini contents array
          const contents = [];
          let systemInstruction;

          for (const m of messages || []) {
            if (m.role === 'system') {
              systemInstruction = { parts: [{ text: m.content }] };
            } else {
              contents.push({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }]
              });
            }
          }

          if (contents.length === 0) {
            contents.push({ role: 'user', parts: [{ text: 'Respond concisely.' }] });
          }

          const body = {
            contents,
            generationConfig: {
              temperature: temperature ?? 0.4,
              maxOutputTokens: max_tokens || 1200,
              responseMimeType: response_format?.type === 'json_object' ? 'application/json' : 'text/plain'
            }
          };

          if (systemInstruction) {
            body.systemInstruction = systemInstruction;
          }

          try {
            const response = await axios.post(url, body, {
              headers: { 'Content-Type': 'application/json' },
              timeout: 30000
            });

            const candidate = response.data?.candidates?.[0];
            const text = candidate?.content?.parts?.[0]?.text || '';
            const usageMetadata = response.data?.usageMetadata;

            return {
              choices: [
                {
                  message: {
                    role: 'assistant',
                    content: text
                  }
                }
              ],
              usage: usageMetadata ? {
                prompt_tokens: usageMetadata.promptTokenCount || 0,
                completion_tokens: usageMetadata.candidatesTokenCount || 0,
                total_tokens: usageMetadata.totalTokenCount || 0
              } : null
            };
          } catch (error) {
            const status = error.response?.status || 500;
            const message = error.response?.data?.error?.message || error.message;
            logger.error('Gemini API Request Failed', { status, message });
            throw new AppError(`Gemini API Error: ${message}`, status >= 400 && status < 600 ? status : 502);
          }
        }
      }
    }
  };
};

module.exports = createGeminiClient();
