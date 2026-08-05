const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../utils/AppError');
const { success } = require('../utils/apiResponse');
const { LearningHistory } = require('../models');

const create = asyncHandler(async (req, res) => {
  const task = await LearningHistory.create({ ...req.body, userId: req.user.id });
  success(res, 'Task created', { task }, 201);
});

const list = asyncHandler(async (req, res) => {
  const tasks = await LearningHistory.findAll({ where: { userId: req.user.id }, order: [['createdAt', 'DESC']] });
  success(res, 'Tasks fetched', { tasks });
});

const complete = asyncHandler(async (req, res) => {
  const task = await LearningHistory.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!task) throw new AppError('Task not found', 404);
  await task.update({ completed: true, progress: 100, completedAt: new Date(), hoursSpent: req.body.hoursSpent ?? task.hoursSpent });
  success(res, 'Task completed', { task });
});

const remove = asyncHandler(async (req, res) => {
  const deleted = await LearningHistory.destroy({ where: { id: req.params.id, userId: req.user.id } });
  if (!deleted) throw new AppError('Task not found', 404);
  success(res, 'Task deleted');
});

module.exports = { create, list, complete, remove };
