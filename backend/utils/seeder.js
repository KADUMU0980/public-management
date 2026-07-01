const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config({ path: require('path').join(__dirname, '../.env') });

const User = require('../models/User');
const Category = require('../models/Category');
const Announcement = require('../models/Announcement');
const Complaint = require('../models/Complaint');

const categories = [
  { name: 'Potholes', icon: '🕳️', description: 'Road potholes and surface damage', department: 'Public Works', color: '#EF4444' },
  { name: 'Garbage', icon: '🗑️', description: 'Garbage collection and waste issues', department: 'Sanitation', color: '#F59E0B' },
  { name: 'Water Leakage', icon: '💧', description: 'Water pipe leaks and supply issues', department: 'Water Board', color: '#3B82F6' },
  { name: 'Broken Streetlights', icon: '💡', description: 'Street lighting failures', department: 'Electricity Board', color: '#FBBF24' },
  { name: 'Sewage', icon: '🚰', description: 'Sewage overflow and blockage', department: 'Sanitation', color: '#8B5CF6' },
  { name: 'Road Damage', icon: '🛣️', description: 'Major road damage and infrastructure', department: 'Public Works', color: '#EC4899' },
  { name: 'Drainage', icon: '🌊', description: 'Drainage system blockage', department: 'Public Works', color: '#06B6D4' },
  { name: 'Illegal Dumping', icon: '⚠️', description: 'Illegal waste dumping', department: 'Environment', color: '#84CC16' },
  { name: 'Public Property Damage', icon: '🏗️', description: 'Damage to public property', department: 'Municipal', color: '#F97316' },
  { name: 'Traffic Signal', icon: '🚦', description: 'Traffic signal malfunction', department: 'Traffic Police', color: '#10B981' },
  { name: 'Others', icon: '📋', description: 'Other civic issues', department: 'General', color: '#6B7280' }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Announcement.deleteMany({});
    console.log('Cleared existing data');

    // Create admin
    const admin = await User.create({
      name: 'Admin CitizenConnect',
      email: 'admin@citizenconnect.gov.in',
      password: 'admin123456',
      role: 'admin',
      isVerified: true,
      isActive: true
    });
    console.log('Admin created: admin@citizenconnect.gov.in / admin123456');

    // Create test citizen
    const citizen = await User.create({
      name: 'Rajesh Kumar',
      email: 'citizen@test.com',
      password: 'citizen123',
      role: 'citizen',
      isVerified: true,
      isActive: true,
      phone: '9876543210'
    });
    console.log('Citizen created: citizen@test.com / citizen123');

    // Seed categories
    await Category.insertMany(categories);
    console.log('Categories seeded');

    // Seed announcements
    await Announcement.create([
      { title: '🎉 Welcome to CitizenConnect!', content: 'Our new Smart Public Complaint Portal is now live. Register and start reporting civic issues in your area.', type: 'success', isPinned: true, createdBy: admin._id },
      { title: '📢 System Maintenance Notice', content: 'Scheduled maintenance on Sunday 2AM-4AM. Service may be temporarily unavailable.', type: 'warning', createdBy: admin._id },
      { title: 'ℹ️ New Feature: Location Tracking', content: 'You can now track the live status of your complaints with our new GPS-enabled tracking system.', type: 'info', createdBy: admin._id }
    ]);
    console.log('Announcements seeded');

    // Seed demo complaints
    const demoComplaints = [
      { title: 'Large pothole on MG Road', description: 'Deep pothole near the bus stop on MG Road causing accidents', category: 'Potholes', priority: 'high', citizen: citizen._id, status: 'in_progress', address: { fullAddress: 'MG Road, Bangalore', city: 'Bangalore', state: 'Karnataka' }, resolutionProgress: 60 },
      { title: 'Streetlight not working', description: 'Street light near park has been broken for 2 weeks', category: 'Broken Streetlights', priority: 'medium', citizen: citizen._id, status: 'assigned', address: { fullAddress: 'Gandhi Park, Bangalore', city: 'Bangalore', state: 'Karnataka' }, resolutionProgress: 30 },
      { title: 'Garbage overflow near market', description: 'Garbage bin overflowing causing health hazard', category: 'Garbage', priority: 'high', citizen: citizen._id, status: 'resolved', address: { fullAddress: 'City Market, Bangalore', city: 'Bangalore', state: 'Karnataka' }, resolutionProgress: 100 }
    ];
    for (const c of demoComplaints) {
      await Complaint.create(c);
    }
    console.log('Demo complaints seeded');

    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedDB();
