import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import clubRoutes from "./routes/clubRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import eventRegistrationRoutes from "./routes/eventRegistrationRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/clubs", clubRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/event-registrations", eventRegistrationRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("University Event & Club Management API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});