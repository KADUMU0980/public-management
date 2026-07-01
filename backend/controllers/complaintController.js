const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');
const { uploadToCloudinary, deleteFromCloudinary } = require('../middlewares/upload');
const { sendEmail, emailTemplates } = require('../utils/emailService');
const User = require('../models/User');

// Helper: create notification
const createNotification = async (userId, title, message, type, complaintId) => {
  await Notification.create({ user: userId, title, message, type, complaintId });
};

// @desc Get citizen complaints
exports.getMyCOmplaints = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category, priority } = req.query;
    const filter = { citizen: req.user._id };
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    const total = await Complaint.countDocuments(filter);
    const complaints = await Complaint.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('citizen', 'name email');

    res.json({ success: true, total, page: Number(page), pages: Math.ceil(total / limit), complaints });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Get single complaint
exports.getComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate('citizen', 'name email phone');
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });
    if (complaint.citizen._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.json({ success: true, complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Create complaint
exports.createComplaint = async (req, res) => {
  try {
    const { title, description, category, priority, address, location } = req.body;
    
    // Upload images
    const images = [];
    if (req.files && req.files.images) {
      const imgFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      for (const file of imgFiles) {
        const result = await uploadToCloudinary(file.buffer, 'complaints');
        images.push({ url: result.secure_url, publicId: result.public_id });
      }
    }

    // Upload video
    let video = null;
    if (req.files && req.files.video && req.files.video[0]) {
      const result = await uploadToCloudinary(req.files.video[0].buffer, 'complaints/videos', 'video');
      video = { url: result.secure_url, publicId: result.public_id };
    }

    const parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;
    const parsedLocation = typeof location === 'string' ? JSON.parse(location) : location;

    const complaint = await Complaint.create({
      title, description, category, priority,
      address: parsedAddress,
      location: parsedLocation || { type: 'Point', coordinates: [0, 0] },
      images,
      video,
      citizen: req.user._id,
      isEmergency: priority === 'emergency'
    });

    await createNotification(req.user._id, 'Complaint Submitted', `Your complaint "${title}" has been submitted successfully. ID: ${complaint.complaintId}`, 'general', complaint._id);

    res.status(201).json({ success: true, complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Update complaint (before review)
exports.updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });
    if (complaint.citizen.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'Not authorized' });
    if (!['pending'].includes(complaint.status)) return res.status(400).json({ success: false, message: 'Cannot edit complaint after review' });

    const { title, description, category, priority, address } = req.body;
    Object.assign(complaint, { title, description, category, priority, address: typeof address === 'string' ? JSON.parse(address) : address });
    await complaint.save();
    res.json({ success: true, complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Delete complaint
exports.deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });
    if (complaint.citizen.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'Not authorized' });
    if (!['pending'].includes(complaint.status)) return res.status(400).json({ success: false, message: 'Cannot delete after review' });

    // Delete images from cloudinary
    for (const img of complaint.images) {
      await deleteFromCloudinary(img.publicId);
    }
    await complaint.deleteOne();
    res.json({ success: true, message: 'Complaint deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Add comment
exports.addComment = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ success: false, message: 'Not found' });

    complaint.comments.push({
      user: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      text: req.body.text
    });
    await complaint.save();
    res.json({ success: true, complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Get citizen dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const citizenId = req.user._id;
    const [total, pending, resolved, rejected, inProgress] = await Promise.all([
      Complaint.countDocuments({ citizen: citizenId }),
      Complaint.countDocuments({ citizen: citizenId, status: 'pending' }),
      Complaint.countDocuments({ citizen: citizenId, status: 'resolved' }),
      Complaint.countDocuments({ citizen: citizenId, status: 'rejected' }),
      Complaint.countDocuments({ citizen: citizenId, status: 'in_progress' })
    ]);
    const recentComplaints = await Complaint.find({ citizen: citizenId }).sort({ createdAt: -1 }).limit(5);
    res.json({ success: true, stats: { total, pending, resolved, rejected, inProgress }, recentComplaints });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
