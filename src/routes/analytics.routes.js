const router = require('express').Router();
const controller = require('../controllers/analytics.controller');

router.get('/weekly-progress', controller.weeklyProgress);
router.get('/monthly-progress', controller.monthlyProgress);
router.get('/learning-hours', controller.learningHours);
router.get('/skills-growth', controller.skillsGrowth);
router.get('/roadmap-completion', controller.roadmapCompletion);
router.get('/category-distribution', controller.categoryDistribution);

module.exports = router;
