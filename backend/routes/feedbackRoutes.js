const express = require('express');
const router = express.Router();
const { submitFeedback, getAllFeedback } = require('../controllers/feedbackController');
const { protect, authorize } = require('../middlewares/auth');

router.post('/:complaintId', protect, submitFeedback);
router.get('/', protect, authorize('admin'), getAllFeedback);

module.exports = router;
