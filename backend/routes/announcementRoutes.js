import express from "express";
import {
  createAnnouncement,
  getAnnouncementsByClub,
} from "../controllers/announcementController.js";

const router = express.Router();

router.post("/", createAnnouncement);
router.get("/club/:club", getAnnouncementsByClub);

export default router;