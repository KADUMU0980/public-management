const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  icon: { type: String, default: '📋' },
  description: String,
  department: String,
  isActive: { type: Boolean, default: true },
  color: { type: String, default: '#3B82F6' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Category', categorySchema);
