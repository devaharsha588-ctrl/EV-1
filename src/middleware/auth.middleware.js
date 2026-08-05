const jwt = require('jsonwebtoken');
const env = require('../config/env');
const AppError = require('../utils/AppError');
const { User } = require('../models');
const asyncHandler = require('./asyncHandler');

const authenticate = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) throw new AppError('Authentication required', 401);

  const payload = jwt.verify(token, env.jwt.accessSecret);
  const user = await User.findByPk(payload.id);
  if (!user) throw new AppError('User not found', 401);
  req.user = user;
  next();
});

const authorize = (...roles) => (req, res, next) => {
  if (roles.length && !roles.includes(req.user.role)) throw new AppError('Forbidden', 403);
  next();
};

module.exports = { authenticate, authorize };
