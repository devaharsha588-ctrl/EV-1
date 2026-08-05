const router = require('express').Router();
const controller = require('../controllers/task.controller');
const validators = require('../validators/common.validators');
const validate = require('../middleware/validate.middleware');

router.post('/', validators.taskCreate, validate, controller.create);
router.get('/', controller.list);
router.put('/:id/complete', validators.taskUpdate, validate, controller.complete);
router.delete('/:id', validators.taskUpdate, validate, controller.remove);

module.exports = router;
