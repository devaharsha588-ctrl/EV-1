const { Roadmap, LearningHistory } = require('../models');
const personalization = require('../services/ai/personalization.service');
const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../utils/AppError');

exports.list = asyncHandler(async (req, res) => {
  const roadmaps = await Roadmap.findAll({
    where: { userId: req.user.id },
    order: [['createdAt', 'DESC']]
  });
  res.json({
    success: true,
    message: 'Roadmaps retrieved successfully',
    data: { roadmaps }
  });
});

exports.getById = asyncHandler(async (req, res) => {
  const roadmap = await Roadmap.findOne({
    where: { id: req.params.id, userId: req.user.id }
  });
  if (!roadmap) throw new AppError('Roadmap not found', 404);
  res.json({
    success: true,
    message: 'Roadmap retrieved successfully',
    data: { roadmap }
  });
});

exports.generate = asyncHandler(async (req, res) => {
  const tasks = await LearningHistory.findAll({ where: { userId: req.user.id }, limit: 20 });
  const generated = await personalization.generatePlan(req.user, { completedTasks: tasks });

  const milestones = (generated.data.weeklyRoadmap || []).map((week, index) => ({
    step: index + 1,
    title: week.focus || week.title || `Week ${index + 1}`,
    description: week.goal || week.description || '',
    topics: week.topics || [],
    completed: false
  }));

  const roadmap = await Roadmap.create({
    userId: req.user.id,
    title: `${req.user.profession || 'Career'} Development Roadmap`,
    profession: req.user.profession || 'General',
    status: 'active',
    milestones,
    aiProvider: generated.provider
  });

  res.status(201).json({
    success: true,
    message: 'Personalized AI roadmap generated successfully',
    data: { roadmap }
  });
});

exports.updateStatus = asyncHandler(async (req, res) => {
  const roadmap = await Roadmap.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!roadmap) throw new AppError('Roadmap not found', 404);

  const { status, milestones } = req.body;
  if (status) roadmap.status = status;
  if (milestones) roadmap.milestones = milestones;
  await roadmap.save();

  res.json({
    success: true,
    message: 'Roadmap updated successfully',
    data: { roadmap }
  });
});
