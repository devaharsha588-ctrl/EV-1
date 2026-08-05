const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../utils/AppError');
const { success } = require('../utils/apiResponse');
const { Notification, Achievement } = require('../models');

const notifications = asyncHandler(async (req, res) => {
  const items = await Notification.findAll({ where: { userId: req.user.id }, order: [['createdAt', 'DESC']] });
  success(res, 'Notifications fetched', { notifications: items });
});

const markRead = asyncHandler(async (req, res) => {
  const item = await Notification.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!item) throw new AppError('Notification not found', 404);
  await item.update({ read: true });
  success(res, 'Notification marked as read', { notification: item });
});

const achievements = asyncHandler(async (req, res) => {
  const items = await Achievement.findAll({ where: { userId: req.user.id }, order: [['earnedAt', 'DESC']] });
  success(res, 'Achievements fetched', { achievements: items });
});

module.exports = { notifications, markRead, achievements };
