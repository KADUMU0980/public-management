const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['complaint_accepted', 'complaint_rejected', 'complaint_assigned', 'work_started', 'work_completed', 'complaint_closed', 'general'], default: 'general' },
  complaintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint' },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

notificationSchema.index({ user: 1, isRead: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
