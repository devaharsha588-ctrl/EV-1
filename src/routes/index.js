const router = require('express').Router();
const { authenticate } = require('../middleware/auth.middleware');

router.use('/auth', require('./auth.routes'));
router.use('/users', authenticate, require('./user.routes'));
router.use('/profile', authenticate, require('./profile.routes'));
router.use('/dashboard', authenticate, require('./dashboard.routes'));
router.use('/ai', authenticate, require('./ai.routes'));
router.use('/chat', authenticate, require('./chat.routes'));
router.use('/recommendations', authenticate, require('./recommendation.routes'));
router.use('/resume', authenticate, require('./resume.routes'));
router.use('/github', authenticate, require('./github.routes'));
router.use('/tasks', authenticate, require('./task.routes'));
router.use('/feedback', authenticate, require('./feedback.routes'));
router.use('/analytics', authenticate, require('./analytics.routes'));
router.use('/', authenticate, require('./notification.routes'));

module.exports = router;
