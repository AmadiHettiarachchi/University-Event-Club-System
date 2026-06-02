import express from "express";
import {
  createEvent,
  getEvents,
  getEventsByClub,
  updateEvent,
} from "../controllers/eventController.js";

const router = express.Router();

router.post("/", createEvent);
router.get("/", getEvents);
router.get("/club/:club", getEventsByClub);
router.put("/:id", updateEvent);

export default router;