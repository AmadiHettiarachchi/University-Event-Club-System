import express from "express";
import {
  markAttendance,
  getAttendanceByClub,
  getAttendanceByStudent,
} from "../controllers/attendanceController.js";

const router = express.Router();

router.post("/", markAttendance);
router.get("/club/:club", getAttendanceByClub);
router.get("/student/:studentId", getAttendanceByStudent);

export default router;