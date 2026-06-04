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

    clubs: {
      type: [String],
      default: [],
    },

    leaderClub: {
      type: String,
      required: function () {
        return this.role === "clubLeader";
      },
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;