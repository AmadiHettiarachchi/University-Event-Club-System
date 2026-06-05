import mongoose from "mongoose";

const eventSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    venue: { type: String, required: true },
    date: { type: Date, required: true },

    registrationDeadline: {
      type: Date,
      required: true,
    },

    club: { type: String, required: true },
    createdBy: { type: String, required: true },

    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    poster: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;