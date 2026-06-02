import express from "express";
import {
  submitFeedback,
  getFeedbackByClub,
} from "../controllers/feedbackController.js";

const router = express.Router();

router.post("/", submitFeedback);
router.get("/club/:club", getFeedbackByClub);

export default router;