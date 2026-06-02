import Feedback from "../models/Feedback.js";

export const submitFeedback = async (req, res) => {
  try {
    const {
      eventId,
      studentId,
      studentName,
      studentEmail,
      club,
      rating,
      comment,
    } = req.body;

    const alreadySubmitted = await Feedback.findOne({
      eventId,
      studentId,
    });

    if (alreadySubmitted) {
      return res.status(400).json({
        message: "You already submitted feedback for this event",
      });
    }

    const feedback = await Feedback.create({
      eventId,
      studentId,
      studentName,
      studentEmail,
      club,
      rating,
      comment,
    });

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFeedbackByClub = async (req, res) => {
  try {
    const { club } = req.params;

    const feedback = await Feedback.find({ club })
      .populate("eventId", "title date venue")
      .sort({ createdAt: -1 });

    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};