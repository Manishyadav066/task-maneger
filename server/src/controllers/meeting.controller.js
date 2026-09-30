const Meeting = require("../models/meeting.model");

const getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find()
      .populate("participants", "name email avatar role status")
      .sort({ createdAt: -1 })
      .lean();

    const formatted = meetings.map((m) => ({
      id: m._id.toString(),
      _id: m._id.toString(),
      title: m.title,
      time: m.time,
      duration: m.duration,
      platform: m.platform,
      link: m.link,
      status: m.status,
      participants: m.participants || [],
    }));

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createMeeting = async (req, res) => {
  try {
    const { title, time, duration, platform, link, participants, status } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Meeting title is required" });
    }

    const meeting = await Meeting.create({
      title: title.trim(),
      time: time || "11:00 AM - 12:00 PM",
      duration: duration || "45m",
      platform: platform || "Google Meet",
      link: link || "https://meet.google.com/xyz-taskflow",
      status: status || "upcoming",
      participants: Array.isArray(participants) ? participants : [req.user.userId],
      createdBy: req.user.userId,
    });

    const populated = await Meeting.findById(meeting._id)
      .populate("participants", "name email avatar role status")
      .lean();

    res.status(201).json({
      id: populated._id.toString(),
      _id: populated._id.toString(),
      title: populated.title,
      time: populated.time,
      duration: populated.duration,
      platform: populated.platform,
      link: populated.link,
      status: populated.status,
      participants: populated.participants || [],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }
    await meeting.deleteOne();
    res.status(200).json({ message: "Meeting deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMeetings,
  createMeeting,
  deleteMeeting,
};
