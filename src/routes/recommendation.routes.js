const router = require('express').Router();
const controller = require('../controllers/recommendation.controller');

router.get('/', controller.list);
router.post('/regenerate', controller.regenerate);

module.exports = router;
