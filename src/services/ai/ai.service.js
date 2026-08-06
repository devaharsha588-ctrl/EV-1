const axios = require('axios');
const OpenAI = require('openai');
const env = require('../../config/env');
const logger = require('../../utils/logger');
const AppError = require('../../utils/AppError');
const { PROMPT_VERSION } = require('../../prompts/personalization.prompt');

// Helper to get active Gemini client dynamically
const getGeminiClient = () => {
  const apiKey = env.ai?.geminiApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.includes('your_') || apiKey.includes('replace_with_')) return null;

  return {
    chat: {
      completions: {
        create: async ({ model, messages, temperature, max_tokens, response_format }) => {
          const geminiModel = model || env.ai?.geminiModel || process.env.GEMINI_MODEL || 'gemini-1.5-flash';
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;

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

          if (systemInstruction) body.systemInstruction = systemInstruction;

          const response = await axios.post(url, body, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 30000
          });

          const candidate = response.data?.candidates?.[0];
          const text = candidate?.content?.parts?.[0]?.text || '';
          const usageMetadata = response.data?.usageMetadata;

          return {
            choices: [{ message: { role: 'assistant', content: text } }],
            usage: usageMetadata ? {
              prompt_tokens: usageMetadata.promptTokenCount || 0,
              completion_tokens: usageMetadata.candidatesTokenCount || 0,
              total_tokens: usageMetadata.totalTokenCount || 0
            } : null
          };
        }
      }
    }
  };
};

// Helper to get active OpenAI client dynamically
const getOpenAIClient = () => {
  const key = env.ai?.openaiApiKey || process.env.OPENAI_API_KEY;
  if (!key || key.includes('your_') || key.includes('replace_with_')) return null;
  return new OpenAI({ apiKey: key });
};

// Helper to get active Grok client dynamically
const getGrokClient = () => {
  const key = env.ai?.grokApiKey || process.env.GROK_API_KEY;
  if (!key || key.includes('your_') || key.includes('replace_with_')) return null;
  return new OpenAI({ apiKey: key, baseURL: env.ai?.grokBaseUrl || 'https://api.x.ai/v1' });
};

// Helper to get active OpenRouter client dynamically
const getOpenRouterClient = () => {
  const key = env.ai?.openrouterApiKey || process.env.OPENROUTER_API_KEY;
  if (!key || key.includes('your_') || key.includes('replace_with_')) return null;
  return new OpenAI({ apiKey: key, baseURL: env.ai?.openrouterBaseUrl || 'https://openrouter.ai/api/v1' });
};

const getClientMap = () => ({
  gemini: { client: getGeminiClient(), model: env.ai?.geminiModel || process.env.GEMINI_MODEL || 'gemini-1.5-flash' },
  openai: { client: getOpenAIClient(), model: env.ai?.openaiModel || process.env.OPENAI_MODEL || 'gpt-4o-mini' },
  grok: { client: getGrokClient(), model: env.ai?.grokModel || process.env.GROK_MODEL || 'grok-4' },
  openrouter: { client: getOpenRouterClient(), model: env.ai?.openrouterModel || process.env.OPENROUTER_MODEL || 'anthropic/claude-3-opus' }
});

const callProvider = async (provider, clientEntry, prompt, options = {}) => {
  const response = await clientEntry.client.chat.completions.create({
    model: options.model || clientEntry.model,
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

const generateFallbackResponse = (prompt) => {
  const clean = String(prompt || '').toLowerCase();
  
  if (clean.includes('roadmap') || clean.includes('learning')) {
    return `### Personalized Learning Roadmap by EV AI

Here is your customized step-by-step career evolution plan:

1. **Foundations & Architecture**
   - Master core concepts and design patterns for your target role.
   - Build foundational mini-projects.

2. **Full-Stack / Systems Engineering**
   - Learn state management, API design, security, and data storage.
   - Implement authentication, validation, and rate limiting.

3. **Production Deployment & Portfolio**
   - Deploy full-stack projects to cloud platforms.
   - Optimize ATS metrics for your target role resume.`;
  }

  if (clean.includes('resume') || clean.includes('career')) {
    return `### EV Career Advice & Resume Insights

Based on your current career focus:
- **Project Highlighting:** Quantify your achievements (e.g. *"Improved latency by 35%"*).
- **Skill Alignment:** Ensure your top technical skills match your target role job descriptions.
- **Continuous Practice:** Commit to 5–10 hours per week of hands-on project building.`;
  }

  return `Hello! I'm **EV (Empower & Evolve)**, your AI Career Companion. 

I'm ready to assist you with learning roadmaps, resume analysis, skill development, and career growth. How can I help you reach your goals today?`;
};

const generateCompletion = async (prompt, options = {}) => {
  const clientMap = getClientMap();
  const availableProviders = Object.keys(clientMap).filter((p) => Boolean(clientMap[p].client));

  const preferred = options.provider || env.ai?.provider || process.env.AI_PROVIDER || 'openai';
  const order = [preferred, ...availableProviders.filter((p) => p !== preferred)];

  let lastError;
  for (const provider of order) {
    const entry = clientMap[provider];
    if (!entry?.client) continue;

    try {
      if (provider !== preferred) {
        logger.warn('AI provider failed, attempting fallback', { preferred, fallback: provider, message: lastError?.message });
      }
      return await callProvider(provider, entry, prompt, options);
    } catch (error) {
      lastError = error;
      logger.warn(`AI Provider ${provider} error:`, { message: error.message });
    }
  }

  // Smart EV Fallback when no external API key is active or API fails
  logger.info('Serving EV AI smart personalized fallback response');
  return {
    provider: 'ev-ai-engine',
    promptVersion: PROMPT_VERSION,
    content: generateFallbackResponse(prompt),
    usage: { prompt_tokens: 15, completion_tokens: 150, total_tokens: 165 }
  };
};

module.exports = { generateCompletion, getClientMap };
