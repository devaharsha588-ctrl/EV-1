const asyncHandler = require('../middleware/asyncHandler');
const { success } = require('../utils/apiResponse');
const { User } = require('../models');

const me = asyncHandler(async (req, res) => {
  success(res, 'User fetched', { user: req.user });
});

const updateMe = asyncHandler(async (req, res) => {
  const allowed = ['name', 'avatar', 'college', 'degree', 'branch', 'year', 'github', 'linkedin', 'portfolio', 'bio'];
  const updates = allowed.reduce((acc, key) => {
    if (Object.prototype.hasOwnProperty.call(req.body, key)) acc[key] = req.body[key];
    return acc;
  }, {});
  await req.user.update(updates);
  success(res, 'User updated', { user: await User.findByPk(req.user.id) });
});

module.exports = { me, updateMe };
