import mongoose from "mongoose";

const eventRegistrationSchema = mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    studentName: {
      type: String,
      required: true,
    },

    studentEmail: {
      type: String,
      required: true,
    },

    club: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const EventRegistration = mongoose.model(
  "EventRegistration",
  eventRegistrationSchema
);

export default EventRegistration;