import express from "express";
import {
  getAdminStats,
  getAllUsers,
  getAllEvents,
  deleteUser,
  deleteEvent,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/stats", getAdminStats);
router.get("/users", getAllUsers);
router.get("/events", getAllEvents);
router.delete("/users/:id", deleteUser);
router.delete("/events/:id", deleteEvent);
export default router;