import express from "express";
import {
  createEvent,
  getEvents,
  getEventsByClub,
  updateEvent,
  deleteEvent
} from "../controllers/eventController.js";

const router = express.Router();

router.post("/", createEvent);
router.get("/", getEvents);
router.get("/club/:club", getEventsByClub);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

export default router;