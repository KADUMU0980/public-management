const express = require('express');
const router = express.Router();
const { getMyCOmplaints, getComplaint, createComplaint, updateComplaint, deleteComplaint, addComment, getDashboardStats } = require('../controllers/complaintController');
const { protect, authorize } = require('../middlewares/auth');
const { upload } = require('../middlewares/upload');

router.get('/dashboard', protect, getDashboardStats);
router.get('/my', protect, getMyCOmplaints);
router.post('/', protect, upload.fields([{ name: 'images', maxCount: 5 }, { name: 'video', maxCount: 1 }]), createComplaint);
router.get('/:id', protect, getComplaint);
router.put('/:id', protect, updateComplaint);
router.delete('/:id', protect, deleteComplaint);
router.post('/:id/comment', protect, addComment);

module.exports = router;
