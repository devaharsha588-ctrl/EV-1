const router = require('express').Router();
const controller = require('../controllers/roadmap.controller');

router.get('/', controller.list);
router.post('/generate', controller.generate);
router.get('/:id', controller.getById);
router.patch('/:id', controller.updateStatus);

module.exports = router;
