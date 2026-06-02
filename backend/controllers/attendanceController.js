import Attendance from "../models/Attendance.js";
import EventRegistration from "../models/EventRegistration.js";

export const markAttendance = async (req, res) => {
  try {
    const { qrToken } = req.body;

    if (!qrToken) {
      return res.status(400).json({ message: "QR token is required" });
    }

    const registration = await EventRegistration.findOne({ qrToken });

    if (!registration) {
      return res.status(404).json({ message: "Invalid QR code" });
    }

    if (registration.qrUsed) {
      return res.status(400).json({
        message: "This QR code has already been used",
      });
    }

    const alreadyMarked = await Attendance.findOne({
      eventId: registration.eventId,
      studentId: registration.studentId,
    });

    if (alreadyMarked) {
      return res.status(400).json({
        message: "Attendance already marked",
      });
    }

    const attendance = await Attendance.create({
      eventId: registration.eventId,
      studentId: registration.studentId,
      studentName: registration.studentName,
      studentEmail: registration.studentEmail,
      club: registration.club,
    });

    registration.qrUsed = true;
    await registration.save();

    res.status(201).json({
      message: "Attendance marked successfully",
      attendance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAttendanceByClub = async (req, res) => {
  try {
    const { club } = req.params;

    const attendance = await Attendance.find({ club })
      .populate("eventId", "title date venue")
      .sort({ createdAt: -1 });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAttendanceByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const attendance = await Attendance.find({ studentId }).sort({
      createdAt: -1,
    });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markCertificateDownloaded = async (req, res) => {
  try {
    const { eventId, studentId } = req.body;

    const attendance = await Attendance.findOne({ eventId, studentId });

    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    if (attendance.certificateDownloaded) {
      return res.status(400).json({
        message: "Certificate already downloaded",
      });
    }

    attendance.certificateDownloaded = true;
    await attendance.save();

    res.json({
      message: "Certificate download recorded",
      attendance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};