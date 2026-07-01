const Complaint = require('../models/Complaint');
const User = require('../models/User');
const Notification = require('../models/Notification');
const AdminLog = require('../models/AdminLog');
const Announcement = require('../models/Announcement');
const Feedback = require('../models/Feedback');
const { sendEmail, emailTemplates } = require('../utils/emailService');

const logAction = async (admin, action, targetType, targetId, details, ip) => {
  await AdminLog.create({ admin: admin._id, adminName: admin.name, action, targetType, targetId, details, ip });
};

const notifyUser = async (userId, title, message, type, complaintId) => {
  await Notification.create({ user: userId, title, message, type, complaintId });
};

// @desc Admin dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const [total, pending, resolved, rejected, emergency, todayCount, monthCount, totalUsers] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'pending' }),
      Complaint.countDocuments({ status: 'resolved' }),
      Complaint.countDocuments({ status: 'rejected' }),
      Complaint.countDocuments({ isEmergency: true, status: { $nin: ['resolved', 'closed'] } }),
      Complaint.countDocuments({ createdAt: { $gte: today } }),
      Complaint.countDocuments({ createdAt: { $gte: monthStart } }),
      User.countDocuments({ role: 'citizen' })
    ]);

    // Category distribution
    const categoryData = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Monthly trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyTrend = await Complaint.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Status distribution
    const statusData = await Complaint.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const recentComplaints = await Complaint.find().sort({ createdAt: -1 }).limit(10).populate('citizen', 'name email');
    const recentActivities = await AdminLog.find().sort({ createdAt: -1 }).limit(10);

    res.json({ success: true, stats: { total, pending, resolved, rejected, emergency, todayCount, monthCount, totalUsers }, categoryData, monthlyTrend, statusData, recentComplaints, recentActivities });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Get all complaints (admin)
exports.getAllComplaints = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category, priority, search, dateFrom, dateTo } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }
    if (search) {
      filter.$or = [
        { complaintId: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { 'address.city': { $regex: search, $options: 'i' } }
      ];
    }
    const total = await Complaint.countDocuments(filter);
    const complaints = await Complaint.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('citizen', 'name email phone');

    res.json({ success: true, total, page: Number(page), pages: Math.ceil(total / limit), complaints });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Update complaint status (admin)
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status, remark, assignedDepartment, assignedTo, internalNotes, resolutionProgress, rejectionReason } = req.body;
    const complaint = await Complaint.findById(req.params.id).populate('citizen', 'name email');
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });

    complaint.status = status;
    if (assignedDepartment) complaint.assignedDepartment = assignedDepartment;
    if (assignedTo) complaint.assignedTo = assignedTo;
    if (internalNotes) complaint.internalNotes = internalNotes;
    if (resolutionProgress !== undefined) complaint.resolutionProgress = resolutionProgress;
    if (rejectionReason) complaint.rejectionReason = rejectionReason;

    complaint.statusHistory.push({
      status, remark, updatedBy: req.user._id, updatedByName: req.user.name, timestamp: new Date()
    });

    await complaint.save();

    // Notify citizen
    const notifType = status === 'rejected' ? 'complaint_rejected' : status === 'resolved' ? 'work_completed' : status === 'assigned' ? 'complaint_assigned' : status === 'in_progress' ? 'work_started' : status === 'closed' ? 'complaint_closed' : 'complaint_accepted';
    const notifTitle = `Complaint ${status.replace('_', ' ').toUpperCase()}`;
    await notifyUser(complaint.citizen._id, notifTitle, `Your complaint ${complaint.complaintId} status: ${status}. ${remark || ''}`, notifType, complaint._id);

    // Send email
    if (complaint.citizen.email) {
      await sendEmail({ to: complaint.citizen.email, subject: `CitizenConnect - Complaint ${complaint.complaintId} Update`, html: emailTemplates.statusUpdate(complaint.citizen.name, complaint.complaintId, status, remark) });
    }

    await logAction(req.user, `Updated complaint status to ${status}`, 'Complaint', complaint._id, remark, req.ip);
    res.json({ success: true, complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Delete complaint (admin)
exports.deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) return res.status(404).json({ success: false, message: 'Not found' });
    await logAction(req.user, 'Deleted complaint', 'Complaint', complaint._id, '', req.ip);
    res.json({ success: true, message: 'Complaint deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Get all users (admin)
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, isActive } = req.query;
    const filter = { role: 'citizen' };
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];

    const total = await User.countDocuments(filter);
    const users = await User.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    res.json({ success: true, total, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Suspend/Activate user
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    await logAction(req.user, `${user.isActive ? 'Activated' : 'Suspended'} user`, 'User', user._id, '', req.ip);
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Not found' });
    await logAction(req.user, 'Deleted user', 'User', user._id, '', req.ip);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Generate reports
exports.generateReport = async (req, res) => {
  try {
    const { period } = req.query;
    const now = new Date();
    let startDate;
    if (period === 'daily') startDate = new Date(now.setHours(0, 0, 0, 0));
    else if (period === 'weekly') { startDate = new Date(); startDate.setDate(startDate.getDate() - 7); }
    else if (period === 'monthly') { startDate = new Date(); startDate.setMonth(startDate.getMonth() - 1); }
    else { startDate = new Date(); startDate.setFullYear(startDate.getFullYear() - 1); }

    const complaints = await Complaint.find({ createdAt: { $gte: startDate } }).populate('citizen', 'name email');
    const stats = {
      total: complaints.length,
      byStatus: complaints.reduce((acc, c) => { acc[c.status] = (acc[c.status] || 0) + 1; return acc; }, {}),
      byCategory: complaints.reduce((acc, c) => { acc[c.category] = (acc[c.category] || 0) + 1; return acc; }, {}),
      byPriority: complaints.reduce((acc, c) => { acc[c.priority] = (acc[c.priority] || 0) + 1; return acc; }, {})
    };
    res.json({ success: true, period, startDate, stats, complaints });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
