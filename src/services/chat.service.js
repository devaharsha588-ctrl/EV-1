const { Chat, Roadmap, LearningHistory } = require('../models');
const aiService = require('./ai/ai.service');
const { buildChatPrompt } = require('../prompts/personalization.prompt');

const sendMessage = async (user, message, provider) => {
  const [history, roadmap, tasks] = await Promise.all([
    Chat.findAll({ where: { userId: user.id }, order: [['createdAt', 'DESC']], limit: 12 }),
    Roadmap.findOne({ where: { userId: user.id, status: 'active' } }),
    LearningHistory.findAll({ where: { userId: user.id }, limit: 30 })
  ]);

  await Chat.create({ userId: user.id, role: 'user', content: message });
  const prompt = buildChatPrompt(user, { priorConversation: history.reverse(), roadmap, completedTasks: tasks.filter((task) => task.completed) }, message);
  const response = await aiService.generateCompletion(prompt, { provider });
  const assistant = await Chat.create({ userId: user.id, role: 'assistant', content: response.content, aiProvider: response.provider, metadata: { usage: response.usage } });
  return assistant;
};

const history = (userId) => Chat.findAll({ where: { userId }, order: [['createdAt', 'ASC']] });

module.exports = { sendMessage, history };
