process.env.NODE_ENV = 'test';
process.env.AI_PROVIDER = 'openai';
process.env.OPENAI_API_KEY = 'test-openai-key';
process.env.GROK_API_KEY = 'test-grok-key';

const mockOpenaiCreate = jest.fn();
const mockGrokCreate = jest.fn();

jest.mock('../src/services/ai/openai.client', () => ({
  chat: { completions: { create: mockOpenaiCreate } }
}));

jest.mock('../src/services/ai/grok.client', () => ({
  chat: { completions: { create: mockGrokCreate } }
}));

const aiService = require('../src/services/ai/ai.service');

describe('AI provider fallback', () => {
  beforeEach(() => {
    mockOpenaiCreate.mockReset();
    mockGrokCreate.mockReset();
  });

  test('falls back to secondary provider and reports serving provider', async () => {
    mockOpenaiCreate.mockRejectedValueOnce(new Error('rate limited'));
    mockGrokCreate.mockResolvedValueOnce({
      choices: [{ message: { content: 'served by grok' } }],
      usage: { total_tokens: 5 }
    });

    const result = await aiService.generateCompletion('hello', { provider: 'openai' });
    expect(mockOpenaiCreate).toHaveBeenCalledTimes(1);
    expect(mockGrokCreate).toHaveBeenCalledTimes(1);
    expect(result.provider).toBe('grok');
    expect(result.content).toBe('served by grok');
  });
});
