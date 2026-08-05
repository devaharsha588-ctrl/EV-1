const User = require('./user.model');
const RefreshToken = require('./refreshToken.model');
const Roadmap = require('./roadmap.model');
const Recommendation = require('./recommendation.model');
const Chat = require('./chat.model');
const LearningHistory = require('./task.model');
const Feedback = require('./feedback.model');
const Project = require('./project.model');
const Achievement = require('./achievement.model');
const Notification = require('./notification.model');
const ResumeAnalysis = require('./resumeAnalysis.model');
const GithubAnalysis = require('./githubAnalysis.model');
const Analytics = require('./analytics.model');

const userOwned = [
  RefreshToken,
  Roadmap,
  Recommendation,
  Chat,
  LearningHistory,
  Feedback,
  Project,
  Achievement,
  Notification,
  ResumeAnalysis,
  GithubAnalysis,
  Analytics
];

userOwned.forEach((Model) => {
  User.hasMany(Model, { foreignKey: 'userId' });
  Model.belongsTo(User, { foreignKey: 'userId' });
});

Recommendation.hasMany(Feedback, { foreignKey: 'recommendationId' });
Feedback.belongsTo(Recommendation, { foreignKey: 'recommendationId' });
Roadmap.hasMany(LearningHistory, { foreignKey: 'roadmapId' });
LearningHistory.belongsTo(Roadmap, { foreignKey: 'roadmapId' });

module.exports = {
  User,
  RefreshToken,
  Roadmap,
  Recommendation,
  Chat,
  LearningHistory,
  Feedback,
  Project,
  Achievement,
  Notification,
  ResumeAnalysis,
  GithubAnalysis,
  Analytics
};
