const asyncHandler = require('../middleware/asyncHandler');
const { success } = require('../utils/apiResponse');
const githubService = require('../services/github.service');
const { GithubAnalysis } = require('../models');

const analyze = asyncHandler(async (req, res) => {
  success(res, 'GitHub profile analyzed', { analysis: await githubService.analyze(req.user, req.body.username) }, 201);
});

const history = asyncHandler(async (req, res) => {
  const analyses = await GithubAnalysis.findAll({ where: { userId: req.user.id }, order: [['createdAt', 'DESC']] });
  success(res, 'GitHub analysis history fetched', { analyses });
});

module.exports = { analyze, history };
