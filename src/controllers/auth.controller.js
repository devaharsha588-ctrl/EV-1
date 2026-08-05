const env = require('../config/env');
const authService = require('../services/auth.service');
const asyncHandler = require('../middleware/asyncHandler');
const { success } = require('../utils/apiResponse');

const setRefreshCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.isProduction ? 'none' : 'lax',
    signed: true,
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

const register = asyncHandler(async (req, res) => {
  const { user, tokens } = await authService.register(req.body);
  setRefreshCookie(res, tokens.refreshToken);
  success(res, 'Registration successful', { user, accessToken: tokens.accessToken }, 201);
});

const login = asyncHandler(async (req, res) => {
  const { user, tokens } = await authService.login(req.body);
  setRefreshCookie(res, tokens.refreshToken);
  success(res, 'Login successful', { user, accessToken: tokens.accessToken });
});

const refresh = asyncHandler(async (req, res) => {
  const token = req.signedCookies.refreshToken || req.body.refreshToken;
  const { user, tokens } = await authService.refresh(token);
  setRefreshCookie(res, tokens.refreshToken);
  success(res, 'Token refreshed', { user, accessToken: tokens.accessToken });
});

const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.signedCookies.refreshToken || req.body.refreshToken);
  res.clearCookie('refreshToken');
  success(res, 'Logged out successfully');
});

const forgotPassword = asyncHandler(async (req, res) => {
  await authService.forgotPassword(req.body.email);
  success(res, 'If that email exists, a reset link has been sent');
});

const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body);
  success(res, 'Password reset successful');
});

const me = asyncHandler(async (req, res) => success(res, 'Current user', { user: req.user }));

const changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(req.user.id, req.body.currentPassword, req.body.newPassword);
  success(res, 'Password changed successfully');
});

module.exports = { register, login, refresh, logout, forgotPassword, resetPassword, me, changePassword };
