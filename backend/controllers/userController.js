import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const testUser = (req, res) => {
  res.json({ message: "User route working" });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, clubs, leaderClub } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (role === "student" && (!clubs || clubs.length === 0)) {
      return res.status(400).json({
        message: "Please select at least one club",
      });
    }

    if (role === "clubLeader" && !leaderClub) {
      return res.status(400).json({
        message: "Please select your club",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      clubs: role === "student" ? clubs : [],
      leaderClub: role === "clubLeader" ? leaderClub : "",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        clubs: user.clubs,
        leaderClub: user.leaderClub,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        clubs: user.clubs,
        leaderClub: user.leaderClub,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      clubs: user.clubs,
      leaderClub: user.leaderClub,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const emailExists = await User.findOne({ email });

    if (emailExists && emailExists._id.toString() !== req.params.id) {
      return res.status(400).json({ message: "Email already exists" });
    }

    user.name = name || user.name;
    user.email = email || user.email;

    if (password && password.trim() !== "") {
      user.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        clubs: updatedUser.clubs,
        leaderClub: updatedUser.leaderClub,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};