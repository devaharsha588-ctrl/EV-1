const { Chat, Roadmap, LearningHistory, ResumeAnalysis, GithubAnalysis } = require('../models');
const aiService = require('./ai/ai.service');
const { redactPII, summarizeConversation } = require('./ai/personalization.service');
const { assemblePrompt, PROMPT_VERSION } = require('../prompts/personalization.prompt');
const AppError = require('../utils/AppError');
const { Op } = require('sequelize');

const sendMessage = async (user, message, provider, conversationId = null) => {
  if (conversationId) {
    const existing = await Chat.findOne({
      where: {
        [Op.or]: [
          { metadata: { conversationId: String(conversationId) } },
          { metadata: { conversation_id: String(conversationId) } }
        ]
      }
    });

    if (existing && Number(existing.userId) !== Number(user.id)) {
      throw new AppError('Forbidden: conversation does not belong to this user', 403);
    }
  }

  const activeConvId = conversationId || `conv_${user.id}_${Date.now()}`;

  const [history, roadmap, tasks, resume, github] = await Promise.all([
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

  const completedTasks = tasks.filter((t) => t.completed).map((t) => t.title);
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

  const userChat = await Chat.create({
    userId: user.id,
    role: 'user',
    content: message,
    metadata: { conversationId: activeConvId, promptVersion: PROMPT_VERSION }
  });

  const response = await aiService.generateCompletion(assembledPrompt, { provider, promptVersion: PROMPT_VERSION });

  const assistantChat = await Chat.create({
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

  return assistantChat;
};

const history = async (userId, conversationId = null) => {
  const where = { userId };
  if (conversationId) {
    const existing = await Chat.findOne({
      where: {
        [Op.or]: [
          { metadata: { conversationId: String(conversationId) } },
          { metadata: { conversation_id: String(conversationId) } }
        ]
      }
    });

    if (existing && Number(existing.userId) !== Number(userId)) {
      throw new AppError('Forbidden: conversation does not belong to this user', 403);
    }

    where[Op.or] = [
      { metadata: { conversationId: String(conversationId) } },
      { metadata: { conversation_id: String(conversationId) } }
    ];
  }

  return Chat.findAll({ where, order: [['createdAt', 'ASC']] });
};

module.exports = { sendMessage, history };
