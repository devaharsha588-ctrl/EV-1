const buildUserContext = (user, extras = {}) => JSON.stringify({
  profile: {
    name: user.name,
    profession: user.profession,
    experienceLevel: user.experienceLevel,
    skills: user.skills,
    interests: user.interests,
    learningStyle: user.learningStyle,
    weeklyHours: user.weeklyHours,
    targetCompany: user.targetCompany,
    careerGoal: user.careerGoal,
    dreamRole: user.dreamRole,
    bio: user.bio
  },
  ...extras
}, null, 2);

const buildPersonalizationPrompt = (user, extras = {}) => `
You are EV AI, a personalized technology career navigator. Use this specific user's full context.
Return strict JSON with keys: roadmap, learningPlan, dailyTasks, projectSuggestions, internships, courses, interviewQuestions, resources, codingChallenges, motivationMessage, weeklySummary.
User context:
${buildUserContext(user, extras)}
`;

const buildChatPrompt = (user, extras = {}, message) => `
You are EV AI. Answer as a practical career mentor using the user's profile, prior conversation, roadmap, completed tasks, and skill level.
User context:
${buildUserContext(user, extras)}
Current user message: ${message}
`;

module.exports = { buildUserContext, buildPersonalizationPrompt, buildChatPrompt };
