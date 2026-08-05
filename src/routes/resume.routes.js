const router = require('express').Router();
const controller = require('../controllers/resume.controller');
const upload = require('../middleware/upload.middleware');

router.post('/analyze', upload.single('resume'), controller.analyze);
router.get('/history', controller.history);

module.exports = router;
