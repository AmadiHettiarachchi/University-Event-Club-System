import crypto from "crypto";
import Event from "../models/Event.js";
import EventRegistration from "../models/EventRegistration.js";

export const registerForEvent = async (req, res) => {
  try {
    const { eventId, studentId, studentName, studentEmail, club } = req.body;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadline = new Date(event.registrationDeadline);
    deadline.setHours(0, 0, 0, 0);

    if (today > deadline) {
      return res.status(400).json({
        message: "Registration deadline has passed.",
      });
    }

    const registeredCount = await EventRegistration.countDocuments({ eventId });

    if (registeredCount >= event.capacity) {
      return res.status(400).json({
        message: "Event is full. Registration closed.",
      });
    }

    const alreadyRegistered = await EventRegistration.findOne({
      eventId,
      studentId,
    });

    if (alreadyRegistered) {
      return res.status(400).json({
        message: "You already registered for this event",
      });
    }

    const qrToken = crypto.randomBytes(32).toString("hex");

    const registration = await EventRegistration.create({
      eventId,
      studentId,
      studentName,
      studentEmail,
      club,
      qrToken,
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
      .populate("eventId", "title date venue capacity registrationDeadline")
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