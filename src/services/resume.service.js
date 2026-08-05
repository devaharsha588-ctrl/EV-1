const fs = require('fs/promises');
const aiService = require('./ai/ai.service');
const { parseJson } = require('../helpers/json.helper');
const { ResumeAnalysis, Recommendation } = require('../models');

const analyze = async (user, file) => {
  const text = await fs.readFile(file.path, 'utf8').catch(() => `Uploaded resume file: ${file.originalname}`);
  const prompt = `Analyze this resume for the specific user profile. Return strict JSON with score, strengths, weaknesses, atsSuggestions, missingSkills, projectsToAdd, certifications. User: ${JSON.stringify(user)} Resume: ${text.slice(0, 12000)}`;
  const response = await aiService.generateCompletion(prompt, { provider: 'openai', responseFormat: { type: 'json_object' } });
  const parsed = parseJson(response.content, {});
  const analysis = await ResumeAnalysis.create({
    userId: user.id,
    fileUrl: file.path,
    score: parsed.score,
    strengths: parsed.strengths || [],
    weaknesses: parsed.weaknesses || [],
    atsSuggestions: parsed.atsSuggestions || [],
    missingSkills: parsed.missingSkills || [],
    projectsToAdd: parsed.projectsToAdd || [],
    certifications: parsed.certifications || [],
    aiProvider: response.provider
  });
  await Promise.all((parsed.projectsToAdd || []).map((item) => Recommendation.create({
    userId: user.id,
    type: 'project',
    title: item.title || item.name || 'Resume portfolio project',
    description: item.description || '',
    metadata: item,
    source: response.provider
  })));
  return analysis;
};

module.exports = { analyze };
