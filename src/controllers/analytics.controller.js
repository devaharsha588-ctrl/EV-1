const { Op } = require('sequelize');
const asyncHandler = require('../middleware/asyncHandler');
const { success } = require('../utils/apiResponse');
const { LearningHistory, Roadmap } = require('../models');

const dateWindow = (days) => {
  const start = new Date();
  start.setDate(start.getDate() - days);
  return { [Op.gte]: start };
};

const weeklyProgress = asyncHandler(async (req, res) => {
  const tasks = await LearningHistory.findAll({ where: { userId: req.user.id, createdAt: dateWindow(7) } });
  success(res, 'Weekly progress fetched', { total: tasks.length, completed: tasks.filter((task) => task.completed).length });
});

const monthlyProgress = asyncHandler(async (req, res) => {
  const tasks = await LearningHistory.findAll({ where: { userId: req.user.id, createdAt: dateWindow(30) } });
  success(res, 'Monthly progress fetched', { total: tasks.length, completed: tasks.filter((task) => task.completed).length });
});

const learningHours = asyncHandler(async (req, res) => {
  const tasks = await LearningHistory.findAll({ where: { userId: req.user.id } });
  success(res, 'Learning hours fetched', { hours: tasks.reduce((sum, task) => sum + Number(task.hoursSpent || 0), 0) });
});

const skillsGrowth = asyncHandler(async (req, res) => {
  const tasks = await LearningHistory.findAll({ where: { userId: req.user.id } });
  const data = tasks.reduce((acc, task) => ({ ...acc, [task.skill || 'General']: Math.max(acc[task.skill] || 0, task.progress || 0) }), {});
  success(res, 'Skills growth fetched', { skills: data });
});

const roadmapCompletion = asyncHandler(async (req, res) => {
  const [roadmaps, tasks] = await Promise.all([
    Roadmap.findAll({ where: { userId: req.user.id } }),
    LearningHistory.findAll({ where: { userId: req.user.id } })
  ]);
  success(res, 'Roadmap completion fetched', { roadmaps: roadmaps.length, taskCompletionRate: tasks.length ? Math.round((tasks.filter((task) => task.completed).length / tasks.length) * 100) : 0 });
});

const categoryDistribution = asyncHandler(async (req, res) => {
  const tasks = await LearningHistory.findAll({ where: { userId: req.user.id } });
  const categories = tasks.reduce((acc, task) => ({ ...acc, [task.category || 'General']: (acc[task.category] || 0) + 1 }), {});
  success(res, 'Category distribution fetched', { categories });
});

module.exports = { weeklyProgress, monthlyProgress, learningHours, skillsGrowth, roadmapCompletion, categoryDistribution };
