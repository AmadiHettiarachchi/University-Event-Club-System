import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["student", "clubLeader", "admin"],
      default: "student",
    },

    // For students: they can join many clubs
    clubs: {
      type: [String],
      default: [],
    },

    // For club leaders: they manage only one club
    leaderClub: {
      type: String,
      required: function () {
        return this.role === "clubLeader";
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;