const asyncHandler = require('../middleware/asyncHandler');
const { success } = require('../utils/apiResponse');

const allowed = [
  'name', 'avatar', 'college', 'degree', 'branch', 'year', 'profession', 'experienceLevel',
  'skills', 'interests', 'learningStyle', 'weeklyHours', 'targetCompany', 'careerGoal',
  'dreamRole', 'github', 'linkedin', 'portfolio', 'resumeUrl', 'bio'
];

const pickProfile = (body) => allowed.reduce((acc, key) => {
  if (Object.prototype.hasOwnProperty.call(body, key)) acc[key] = body[key];
  return acc;
}, {});

const onboarding = asyncHandler(async (req, res) => {
  await req.user.update({ ...pickProfile(req.body), onboardingComplete: true });
  success(res, 'Onboarding completed', { user: req.user });
});

const getProfile = asyncHandler(async (req, res) => success(res, 'Profile fetched', { user: req.user }));

const updateProfile = asyncHandler(async (req, res) => {
  await req.user.update(pickProfile(req.body));
  success(res, 'Profile updated', { user: req.user });
});

module.exports = { onboarding, getProfile, updateProfile };
