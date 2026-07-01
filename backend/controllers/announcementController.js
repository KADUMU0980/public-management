const Announcement = require('../models/Announcement');

exports.getAnnouncements = async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.pinned) filter.isPinned = true;
    const announcements = await Announcement.find(filter).sort({ isPinned: -1, createdAt: -1 }).populate('createdBy', 'name');
    res.json({ success: true, announcements });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, announcement });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, announcement });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
