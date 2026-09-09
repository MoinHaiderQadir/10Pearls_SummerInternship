const express = require('express');
const { body } = require('express-validator');
const noteController = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

const noteValidationRules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').optional().isString(),
];

router.get('/', noteController.getNotes);
router.get('/:id', noteController.getNote);
router.post('/', noteValidationRules, noteController.createNote);
router.put('/:id', noteValidationRules, noteController.updateNote);
router.delete('/:id', noteController.deleteNote);

module.exports = router;
