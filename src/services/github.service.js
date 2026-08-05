const axios = require('axios');
const aiService = require('./ai/ai.service');
const { parseJson } = require('../helpers/json.helper');
const { GithubAnalysis, Recommendation } = require('../models');

const analyze = async (user, username) => {
  const { data: repos } = await axios.get(`https://api.github.com/users/${encodeURIComponent(username)}/repos`, {
    params: { sort: 'updated', per_page: 20 },
    headers: { Accept: 'application/vnd.github+json' }
  });
  const repoSummary = repos.map((repo) => ({
    name: repo.name,
    description: repo.description,
    language: repo.language,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    updatedAt: repo.updated_at,
    readmeLikely: Boolean(repo.description)
  }));
  const prompt = `Evaluate this GitHub portfolio for ${user.profession || user.dreamRole}. Return strict JSON with score, suggestions, recommendedProjects. User profile: ${JSON.stringify(user)} Repositories: ${JSON.stringify(repoSummary)}`;
  const response = await aiService.generateCompletion(prompt, { responseFormat: { type: 'json_object' } });
  const parsed = parseJson(response.content, { score: 0, suggestions: [], recommendedProjects: [] });
  const analysis = await GithubAnalysis.create({
    userId: user.id,
    username,
    score: parsed.score,
    repoSummary,
    suggestions: parsed.suggestions || [],
    recommendedProjects: parsed.recommendedProjects || [],
    aiProvider: response.provider
  });
  await Promise.all((parsed.recommendedProjects || []).map((item) => Recommendation.create({
    userId: user.id,
    type: 'project',
    title: item.title || item.name || 'GitHub improvement project',
    description: item.description || '',
    metadata: item,
    source: response.provider
  })));
  return analysis;
};

module.exports = { analyze };
