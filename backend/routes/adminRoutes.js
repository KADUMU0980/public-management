const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllComplaints, updateComplaintStatus, deleteComplaint, getAllUsers, toggleUserStatus, deleteUser, generateReport } = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/auth');

router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/complaints', getAllComplaints);
router.put('/complaints/:id/status', updateComplaintStatus);
router.delete('/complaints/:id', deleteComplaint);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle', toggleUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/reports', generateReport);

module.exports = router;
