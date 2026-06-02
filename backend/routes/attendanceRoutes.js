import express from "express";
import {
  markAttendance,
  getAttendanceByClub,
} from "../controllers/attendanceController.js";

const router = express.Router();

router.post("/", markAttendance);
router.get("/club/:club", getAttendanceByClub);

export default router;