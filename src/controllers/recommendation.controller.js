const asyncHandler = require('../middleware/asyncHandler');
const { success } = require('../utils/apiResponse');
const recommendationService = require('../services/recommendation.service');

const list = asyncHandler(async (req, res) => {
  success(res, 'Recommendations fetched', { recommendations: await recommendationService.list(req.user.id, req.query.type) });
});

const regenerate = asyncHandler(async (req, res) => {
  success(res, 'Recommendations regenerated', { recommendations: await recommendationService.regenerate(req.user) }, 201);
});

module.exports = { list, regenerate };
