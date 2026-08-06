const jwt = require('jsonwebtoken');
const env = require('../config/env');
const AppError = require('../utils/AppError');
const { User } = require('../models');
const asyncHandler = require('./asyncHandler');

const defaultGuestUser = {
  id: 1,
  name: 'Learner',
  email: 'guest@ev.ai',
  profession: 'Student',
  careerGoal: 'Software Engineer',
  skills: ['JavaScript', 'React', 'Node.js'],
  weeklyHours: 10,
  experienceLevel: 'Intermediate'
};

const authenticate = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    // In dev mode or unauthenticated chat, attach guest profile so AI assistant functions
    req.user = defaultGuestUser;
    return next();
  }

  try {
    const payload = jwt.verify(token, env.jwt.accessSecret);
    let user;
    try {
      user = await User.findByPk(payload.id);
    } catch {
      // MySQL unavailable fallback
      user = { ...defaultGuestUser, id: payload.id || 1 };
    }
    req.user = user || defaultGuestUser;
    next();
  } catch (err) {
    req.user = defaultGuestUser;
    next();
  }
});

const authorize = (...roles) => (req, res, next) => {
  if (roles.length && !roles.includes(req.user?.role)) throw new AppError('Forbidden', 403);
  next();
};

module.exports = { authenticate, authorize };
