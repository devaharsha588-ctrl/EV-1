const asyncHandler = require('../middleware/asyncHandler');
const { success } = require('../utils/apiResponse');
const { Feedback } = require('../models');

const react = (type) => asyncHandler(async (req, res) => {
  const feedback = await Feedback.create({ userId: req.user.id, recommendationId: req.params.recommendationId, type });
  success(res, `Recommendation ${type} recorded`, { feedback }, 201);
});

const rateAiResponse = asyncHandler(async (req, res) => {
  const feedback = await Feedback.create({ userId: req.user.id, type: 'ai_response_rating', rating: req.body.rating, comment: req.body.comment, metadata: req.body.metadata || {} });
  success(res, 'AI response rating recorded', { feedback }, 201);
});

const create = asyncHandler(async (req, res) => {
  const feedback = await Feedback.create({ ...req.body, userId: req.user.id });
  success(res, 'Feedback recorded', { feedback }, 201);
});

module.exports = { like: react('like'), dislike: react('dislike'), rateAiResponse, create };
