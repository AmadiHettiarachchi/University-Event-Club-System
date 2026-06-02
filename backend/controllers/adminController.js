import User from "../models/User.js";
import Event from "../models/Event.js";
import EventRegistration from "../models/EventRegistration.js";
import Attendance from "../models/Attendance.js";
import Feedback from "../models/Feedback.js";
import Announcement from "../models/Announcement.js";

export const getAdminStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalClubLeaders = await User.countDocuments({ role: "clubLeader" });
    const totalEvents = await Event.countDocuments();
    const totalRegistrations = await EventRegistration.countDocuments();
    const totalAttendance = await Attendance.countDocuments();
    const totalFeedback = await Feedback.countDocuments();
    const totalAnnouncements = await Announcement.countDocuments();

    res.json({
      totalStudents,
      totalClubLeaders,
      totalEvents,
      totalRegistrations,
      totalAttendance,
      totalFeedback,
      totalAnnouncements,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};