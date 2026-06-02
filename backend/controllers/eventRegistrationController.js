import EventRegistration from "../models/EventRegistration.js";

export const registerForEvent = async (req, res) => {
  try {
    const { eventId, studentId, studentName, studentEmail, club } = req.body;

    const alreadyRegistered = await EventRegistration.findOne({
      eventId,
      studentId,
    });

    if (alreadyRegistered) {
      return res.status(400).json({
        message: "You already registered for this event",
      });
    }

    const registration = await EventRegistration.create({
      eventId,
      studentId,
      studentName,
      studentEmail,
      club,
    });

    res.status(201).json({
      message: "Event registration successful",
      registration,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRegistrationsByClub = async (req, res) => {
  try {
    const { club } = req.params;

    const registrations = await EventRegistration.find({ club })
      .populate("eventId", "title date venue")
      .sort({ createdAt: -1 });

    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRegistrationsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const registrations = await EventRegistration.find({ studentId }).sort({
      createdAt: -1,
    });

    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};