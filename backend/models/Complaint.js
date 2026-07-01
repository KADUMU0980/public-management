const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const complaintUpdateSchema = new mongoose.Schema({
  status: { type: String, enum: ['pending', 'verified', 'assigned', 'in_progress', 'resolved', 'rejected', 'closed'] },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedByName: String,
  remark: String,
  timestamp: { type: Date, default: Date.now }
});

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: String,
  userRole: String,
  text: String,
  createdAt: { type: Date, default: Date.now }
});

const complaintSchema = new mongoose.Schema({
  complaintId: { type: String, unique: true },
  title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 100 },
  description: { type: String, required: [true, 'Description is required'], maxlength: 2000 },
  category: { type: String, required: true, enum: ['Potholes', 'Garbage', 'Water Leakage', 'Broken Streetlights', 'Sewage', 'Road Damage', 'Drainage', 'Illegal Dumping', 'Public Property Damage', 'Traffic Signal', 'Others'] },
  priority: { type: String, enum: ['low', 'medium', 'high', 'emergency'], default: 'medium' },
  status: { type: String, enum: ['pending', 'verified', 'assigned', 'in_progress', 'resolved', 'rejected', 'closed'], default: 'pending' },
  citizen: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  address: {
    street: String,
    area: String,
    city: String,
    state: String,
    pincode: String,
    fullAddress: String
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  images: [{ url: String, publicId: String }],
  video: { url: String, publicId: String },
  assignedDepartment: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  internalNotes: String,
  statusHistory: [complaintUpdateSchema],
  comments: [commentSchema],
  resolutionProgress: { type: Number, default: 0 },
  isEmergency: { type: Boolean, default: false },
  rejectionReason: String,
  feedbackGiven: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Auto-generate Complaint ID
complaintSchema.pre('save', async function () {
  if (!this.complaintId) {
    const count = await mongoose.model('Complaint').countDocuments();
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    this.complaintId = `CC-${year}${month}-${String(count + 1).padStart(5, '0')}`;
  }
});

// Add initial status to history
complaintSchema.pre('save', function () {
  if (this.isNew) {
    this.statusHistory.push({
      status: 'pending',
      updatedByName: 'System',
      remark: 'Complaint submitted successfully',
      timestamp: new Date()
    });
  }
});

complaintSchema.index({ location: '2dsphere' });
complaintSchema.index({ citizen: 1 });
complaintSchema.index({ status: 1 });
complaintSchema.index({ category: 1 });
complaintSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Complaint', complaintSchema);
