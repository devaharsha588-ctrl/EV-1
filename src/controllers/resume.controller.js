const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../utils/AppError');
const { success } = require('../utils/apiResponse');
const resumeService = require('../services/resume.service');
const { ResumeAnalysis } = require('../models');

const analyze = asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError('Resume file is required', 422);
  success(res, 'Resume analyzed', { analysis: await resumeService.analyze(req.user, req.file) }, 201);
});

const history = asyncHandler(async (req, res) => {
  const analyses = await ResumeAnalysis.findAll({ where: { userId: req.user.id }, order: [['createdAt', 'DESC']] });
  success(res, 'Resume analysis history fetched', { analyses });
});

module.exports = { analyze, history };
