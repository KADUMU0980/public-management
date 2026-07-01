const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  adminName: String,
  action: { type: String, required: true },
  targetType: String,
  targetId: mongoose.Schema.Types.ObjectId,
  details: String,
  ip: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AdminLog', adminLogSchema);
