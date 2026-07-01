const Feedback = require('../models/Feedback');
const Complaint = require('../models/Complaint');

exports.submitFeedback = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.complaintId);
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });
    if (complaint.citizen.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'Not authorized' });
    if (complaint.feedbackGiven) return res.status(400).json({ success: false, message: 'Feedback already given' });

    const feedback = await Feedback.create({ complaint: complaint._id, citizen: req.user._id, ...req.body });
    complaint.feedbackGiven = true;
    await complaint.save();
    res.status(201).json({ success: true, feedback });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate('complaint', 'complaintId title').populate('citizen', 'name email').sort({ createdAt: -1 });
    const avgRating = feedbacks.length > 0 ? feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length : 0;
    res.json({ success: true, feedbacks, avgRating: avgRating.toFixed(1) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
