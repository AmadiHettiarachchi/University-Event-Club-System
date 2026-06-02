import express from "express";
import {
  getAdminStats,
  getAllUsers,
  getAllEvents,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/stats", getAdminStats);
router.get("/users", getAllUsers);
router.get("/events", getAllEvents);

export default router;