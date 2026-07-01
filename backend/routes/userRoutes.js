const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Complaint = require('../models/Complaint');
const { protect } = require('../middlewares/auth');

// Get user complaint history (for admin viewing a specific user)
router.get('/:id/complaints', protect, async (req, res) => {
  try {
    const complaints = await Complaint.find({ citizen: req.params.id }).sort({ createdAt: -1 });
    res.json({ success: true, complaints });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
