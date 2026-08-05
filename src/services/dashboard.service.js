const { Op } = require('sequelize');
const { Roadmap, LearningHistory, Recommendation, ResumeAnalysis, GithubAnalysis, Notification } = require('../models');

const getDashboard = async (user) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(todayStart);
  todayEnd.setDate(todayEnd.getDate() + 1);

  const [roadmap, todayTasks, recommendations, resume, github, notifications, tasks] = await Promise.all([
    Roadmap.findOne({ where: { userId: user.id, status: 'active' }, order: [['createdAt', 'DESC']] }),
    LearningHistory.findAll({ where: { userId: user.id, dueDate: { [Op.gte]: todayStart, [Op.lt]: todayEnd } }, limit: 10 }),
    Recommendation.findAll({ where: { userId: user.id }, order: [['createdAt', 'DESC']], limit: 12 }),
    ResumeAnalysis.findOne({ where: { userId: user.id }, order: [['createdAt', 'DESC']] }),
    GithubAnalysis.findOne({ where: { userId: user.id }, order: [['createdAt', 'DESC']] }),
    Notification.findAll({ where: { userId: user.id, read: false }, limit: 10 }),
    LearningHistory.findAll({ where: { userId: user.id }, order: [['createdAt', 'DESC']], limit: 100 })
  ]);

  const completed = tasks.filter((task) => task.completed).length;
  const total = tasks.length;

  return {
    welcomeMessage: `Welcome back, ${user.name}.`,
    currentRoadmap: roadmap,
    todayTasks,
    weeklyProgress: { completed, total, completionRate: total ? Math.round((completed / total) * 100) : 0 },
    skillProgress: tasks.reduce((acc, task) => ({ ...acc, [task.skill || 'General']: Math.max(acc[task.skill] || 0, task.progress) }), {}),
    recommendedProjects: recommendations.filter((item) => item.type === 'project'),
    recommendedCourses: recommendations.filter((item) => item.type === 'course'),
    recommendedInternships: recommendations.filter((item) => item.type === 'internship'),
    resumeScore: resume?.score || null,
    githubSuggestions: github?.suggestions || [],
    aiInsights: roadmap?.milestones || [],
    chartData: { tasksCompleted: completed, tasksOpen: total - completed },
    notifications,
    upcomingGoals: tasks.filter((task) => !task.completed).slice(0, 5)
  };
};

module.exports = { getDashboard };
