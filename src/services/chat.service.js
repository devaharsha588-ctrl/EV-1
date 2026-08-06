const { Chat, Roadmap, LearningHistory, ResumeAnalysis, GithubAnalysis } = require('../models');
const aiService = require('./ai/ai.service');
const { redactPII, summarizeConversation } = require('./ai/personalization.service');
const { assemblePrompt, PROMPT_VERSION } = require('../prompts/personalization.prompt');
const AppError = require('../utils/AppError');
const { Op } = require('sequelize');

// In-memory fallback chat store when MySQL is offline
const inMemoryChats = [];

const sendMessage = async (user, message, provider, conversationId = null) => {
  const activeConvId = conversationId || `conv_${user?.id || 'guest'}_${Date.now()}`;

  let history = [];
  let roadmap = null;
  let tasks = [];
  let resume = null;
  let github = null;

  try {
    [history, roadmap, tasks, resume, github] = await Promise.all([
      Chat.findAll({
        where: {
          userId: user.id,
          [Op.or]: [
            { metadata: { conversationId: String(activeConvId) } },
            { metadata: { conversation_id: String(activeConvId) } }
          ]
        },
        order: [['createdAt', 'ASC']]
      }),
      Roadmap.findOne({ where: { userId: user.id, status: 'active' } }),
      LearningHistory.findAll({ where: { userId: user.id }, limit: 30 }),
      ResumeAnalysis.findOne({ where: { userId: user.id }, order: [['createdAt', 'DESC']] }),
      GithubAnalysis.findOne({ where: { userId: user.id }, order: [['createdAt', 'DESC']] })
    ]);
  } catch (dbErr) {
    // DB offline fallback
    history = inMemoryChats.filter((c) => c.conversationId === activeConvId);
  }

  const priorSummary = (history.length > 0 && history[0].metadata?.conversationSummary) || '';
  const conversationSummary = await summarizeConversation(history, priorSummary);

  let resumeSummaryText = 'not provided';
  if (resume) {
    const rawResumeText = `Score: ${resume.score || 'N/A'}. Strengths: ${JSON.stringify(resume.strengths || [])}. Missing Skills: ${JSON.stringify(resume.missingSkills || [])}`;
    resumeSummaryText = redactPII(rawResumeText);
  }

  let githubSummaryText = 'not provided';
  if (github) {
    githubSummaryText = `Username: ${github.username}. Score: ${github.score || 'N/A'}. Suggestions: ${JSON.stringify(github.suggestions || [])}`;
  }

  const completedTasks = (tasks || []).filter((t) => t.completed).map((t) => t.title);
  const currentRoadmapProgress = roadmap ? `Roadmap: ${roadmap.title}. Completed tasks: ${completedTasks.join(', ') || 'none'}` : 'none yet';

  const assembledPrompt = assemblePrompt(
    user,
    {
      resumeSummary: resumeSummaryText,
      githubSummary: githubSummaryText,
      currentRoadmap: currentRoadmapProgress,
      conversationSummary: conversationSummary || 'first conversation'
    },
    message
  );

  const response = await aiService.generateCompletion(assembledPrompt, { provider, promptVersion: PROMPT_VERSION });

  const aiChatObj = {
    id: Date.now(),
    userId: user.id,
    role: 'assistant',
    message: response.content,
    response: response.content,
    aiProvider: response.provider,
    provider: response.provider,
    createdAt: new Date(),
    conversationId: activeConvId,
    metadata: {
      conversationId: activeConvId,
      promptVersion: PROMPT_VERSION,
      conversationSummary,
      usage: response.usage
    }
  };

  try {
    await Chat.create({
      userId: user.id,
      role: 'user',
      content: message,
      metadata: { conversationId: activeConvId, promptVersion: PROMPT_VERSION }
    });

    const dbAssistantChat = await Chat.create({
      userId: user.id,
      role: 'assistant',
      content: response.content,
      aiProvider: response.provider,
      metadata: {
        conversationId: activeConvId,
        promptVersion: PROMPT_VERSION,
        conversationSummary,
        usage: response.usage
      }
    });

    return dbAssistantChat;
  } catch (dbErr) {
    inMemoryChats.push(
      { id: Date.now() - 1, userId: user.id, role: 'user', content: message, conversationId: activeConvId, createdAt: new Date() },
      aiChatObj
    );
    return aiChatObj;
  }
};

const history = async (userId, conversationId = null) => {
  try {
    const where = { userId };
    if (conversationId) {
      where[Op.or] = [
        { metadata: { conversationId: String(conversationId) } },
        { metadata: { conversation_id: String(conversationId) } }
      ];
    }
    return await Chat.findAll({ where, order: [['createdAt', 'ASC']] });
  } catch (dbErr) {
    return inMemoryChats.filter((c) => c.userId === userId || userId === 'guest' || userId === 1);
  }
};

module.exports = { sendMessage, history };
