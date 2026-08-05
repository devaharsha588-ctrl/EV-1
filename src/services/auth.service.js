const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const AppError = require('../utils/AppError');
const { User, RefreshToken } = require('../models');
const emailService = require('./email.service');

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const signAccessToken = (user) => jwt.sign({ id: user.id }, env.jwt.accessSecret, { expiresIn: env.jwt.accessExpire });
const signRefreshToken = (user) => jwt.sign({ id: user.id, nonce: crypto.randomUUID() }, env.jwt.refreshSecret, { expiresIn: env.jwt.refreshExpire });

const refreshExpiryDate = () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

const issueTokens = async (user) => {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  await RefreshToken.create({
    userId: user.id,
    tokenHash: hashToken(refreshToken),
    expiresAt: refreshExpiryDate()
  });
  return { accessToken, refreshToken };
};

const register = async ({ name, email, password }) => {
  const existing = await User.unscoped().findOne({ where: { email } });
  if (existing) throw new AppError('Email is already registered', 409);
  const user = await User.create({ name, email, password: await bcrypt.hash(password, 12) });
  return { user: await User.findByPk(user.id), tokens: await issueTokens(user) };
};

const login = async ({ email, password }) => {
  const user = await User.unscoped().findOne({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) throw new AppError('Invalid email or password', 401);
  return { user: await User.findByPk(user.id), tokens: await issueTokens(user) };
};

const refresh = async (token) => {
  if (!token) throw new AppError('Refresh token is required', 401);
  const payload = jwt.verify(token, env.jwt.refreshSecret);
  const stored = await RefreshToken.findOne({ where: { tokenHash: hashToken(token), revokedAt: null } });
  if (!stored || stored.expiresAt < new Date()) throw new AppError('Refresh token is invalid or expired', 401);
  stored.revokedAt = new Date();
  await stored.save();
  const user = await User.findByPk(payload.id);
  if (!user) throw new AppError('User not found', 404);
  return { user, tokens: await issueTokens(user) };
};

const logout = async (token) => {
  if (!token) return;
  await RefreshToken.update({ revokedAt: new Date() }, { where: { tokenHash: hashToken(token), revokedAt: null } });
};

const forgotPassword = async (email) => {
  const user = await User.unscoped().findOne({ where: { email } });
  if (!user) return;
  const token = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = hashToken(token);
  user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000);
  await user.save();
  await emailService.sendPasswordResetEmail(email, token);
};

const resetPassword = async ({ token, password }) => {
  const user = await User.unscoped().findOne({ where: { resetPasswordToken: hashToken(token) } });
  if (!user || user.resetPasswordExpires < new Date()) throw new AppError('Reset token is invalid or expired', 400);
  user.password = await bcrypt.hash(password, 12);
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();
  await RefreshToken.update({ revokedAt: new Date() }, { where: { userId: user.id, revokedAt: null } });
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.unscoped().findByPk(userId);
  if (!(await bcrypt.compare(currentPassword, user.password))) throw new AppError('Current password is incorrect', 401);
  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();
  await RefreshToken.update({ revokedAt: new Date() }, { where: { userId: user.id, revokedAt: null } });
};

module.exports = { register, login, refresh, logout, forgotPassword, resetPassword, changePassword };
