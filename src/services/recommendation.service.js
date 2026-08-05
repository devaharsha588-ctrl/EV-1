const { Recommendation, LearningHistory, Feedback } = require('../models');
const personalization = require('./ai/personalization.service');

const list = (userId, type) => Recommendation.findAll({ where: { userId, ...(type ? { type } : {}) }, order: [['createdAt', 'DESC']] });

const regenerate = async (user) => {
  const [tasks, feedback] = await Promise.all([
    LearningHistory.findAll({ where: { userId: user.id }, limit: 50 }),
    Feedback.findAll({ where: { userId: user.id }, limit: 50 })
  ]);
  const generated = await personalization.generatePlan(user, { completedTasks: tasks, feedback });
  const items = [
    ...(generated.data.projectSuggestions || []).map((item) => ({ ...item, type: 'project' })),
    ...(generated.data.courses || []).map((item) => ({ ...item, type: 'course' })),
    ...(generated.data.internships || []).map((item) => ({ ...item, type: 'internship' })),
    ...(generated.data.resources || []).map((item) => ({ ...item, type: 'resource' }))
  ];

  return Promise.all(items.map((item) => Recommendation.create({
    userId: user.id,
    type: item.type,
    title: item.title || item.name || 'Untitled recommendation',
    description: item.description || item.reason || '',
    url: item.url,
    metadata: item,
    source: generated.provider
  })));
};

module.exports = { list, regenerate };
