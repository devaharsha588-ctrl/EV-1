process.env.NODE_ENV = 'test';
process.env.OPENAI_API_KEY = 'test-openai-key';

const { assemblePrompt, buildUserContext } = require('../src/prompts/personalization.prompt');
const { redactPII } = require('../src/services/ai/personalization.service');
const chatService = require('../src/services/chat.service');
const AppError = require('../src/utils/AppError');

jest.mock('../src/models', () => {
  const mockChats = [];
  return {
    Chat: {
      findOne: jest.fn(async () => {
        return mockChats.find((c) => c.metadata?.conversationId) || null;
      }),
      findAll: jest.fn(async () => []),
      create: jest.fn(async (data) => {
        const item = { id: mockChats.length + 1, createdAt: new Date(), ...data };
        mockChats.push(item);
        return item;
      }),
      _mockChats: mockChats
    },
    Roadmap: { findOne: jest.fn(async () => null) },
    LearningHistory: { findAll: jest.fn(async () => []) },
    ResumeAnalysis: { findOne: jest.fn(async () => null) },
    GithubAnalysis: { findOne: jest.fn(async () => null) }
  };
});

jest.mock('../src/services/ai/ai.service', () => ({
  generateCompletion: jest.fn(async (prompt) => {
    if (prompt.includes('Full Stack Developer') || prompt.includes('Student')) {
      return { provider: 'openai', content: 'React -> Node.js -> Express -> PostgreSQL' };
    }
    if (prompt.includes('AI Engineer') || prompt.includes('Working Professional')) {
      return { provider: 'openai', content: 'Python -> Machine Learning -> Deep Learning -> LLMs -> RAG -> Vector Databases' };
    }
    return { provider: 'openai', content: 'Personalized learning path recommendation.' };
  })
}));

describe('EV Universal Personalization Engine', () => {
  const studentUser = {
    id: 1,
    name: 'Harsha Student',
    profession: 'Student',
    experienceLevel: 'beginner',
    careerGoal: 'Become Full Stack Developer',
    interests: ['Web Development', 'Frontend'],
    skills: ['HTML', 'CSS']
  };

  const proUser = {
    id: 2,
    name: 'Deva Pro',
    profession: 'Working Professional',
    experienceLevel: 'advanced',
    careerGoal: 'Become AI Engineer',
    interests: ['AI', 'Cloud'],
    skills: ['Python', 'SQL']
  };

  test('assembles distinct prompts for User A (Student) and User B (Professional) for identical questions', () => {
    const question = 'What should I learn next?';

    const promptA = assemblePrompt(studentUser, {}, question);
    const promptB = assemblePrompt(proUser, {}, question);

    expect(promptA).toContain('Student');
    expect(promptA).toContain('Explain concepts more slowly. Suggest projects. Recommend internships.');
    expect(promptA).toContain('Become Full Stack Developer');

    expect(promptB).toContain('Working Professional');
    expect(promptB).toContain('Focus on upskilling, career switching, time-efficient learning.');
    expect(promptB).toContain('Become AI Engineer');

    expect(promptA).not.toEqual(promptB);
  });

  test('redacts PII from resume text context before injection', () => {
    const rawResumeText = 'Contact Harsha at harsha@example.com or +1 (555) 123-4567. SSN: 123-45-6789.';
    const redacted = redactPII(rawResumeText);

    expect(redacted).not.toContain('harsha@example.com');
    expect(redacted).not.toContain('+1 (555) 123-4567');
    expect(redacted).not.toContain('123-45-6789');

    expect(redacted).toContain('[REDACTED_EMAIL]');
    expect(redacted).toContain('[REDACTED_PHONE]');
    expect(redacted).toContain('[REDACTED_GOVT_ID]');
  });

  test('enforces conversation ownership authorization (403 Forbidden for unauthorized user)', async () => {
    const { Chat } = require('../src/models');
    Chat._mockChats.push({
      id: 99,
      userId: 1,
      role: 'user',
      content: 'Private prompt from User 1',
      metadata: { conversationId: 'secret_conv_123' }
    });

    await expect(chatService.sendMessage(proUser, 'Hi', 'openai', 'secret_conv_123')).rejects.toThrow(
      new AppError('Forbidden: conversation does not belong to this user', 403)
    );
  });

  test('handles brand-new users with minimal profile defaults gracefully', () => {
    const newUser = {
      name: 'Newbie',
      profession: 'Student',
      careerGoal: 'Learn Coding'
    };

    const { structuredText } = buildUserContext(newUser, {});
    const parsed = JSON.parse(structuredText);

    expect(parsed.interests).toBe('not specified');
    expect(parsed.knownTechnologies).toBe('not specified');
    expect(parsed.skillLevel).toBe('beginner');
    expect(parsed.resumeSummary).toBe('not provided');
    expect(parsed.githubSummary).toBe('not provided');
    expect(parsed.conversationSummary).toBe('first conversation');
  });
});
