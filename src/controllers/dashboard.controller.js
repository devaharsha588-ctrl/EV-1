const asyncHandler = require('../middleware/asyncHandler');
const { success } = require('../utils/apiResponse');
const dashboardService = require('../services/dashboard.service');

const getDashboard = asyncHandler(async (req, res) => {
  success(res, 'Dashboard fetched', await dashboardService.getDashboard(req.user));
});

module.exports = { getDashboard };
