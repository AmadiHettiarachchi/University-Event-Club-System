import express from "express";
import {
  registerForEvent,
  getRegistrationsByClub,
  getRegistrationsByStudent,
} from "../controllers/eventRegistrationController.js";

const router = express.Router();

router.post("/", registerForEvent);
router.get("/club/:club", getRegistrationsByClub);
router.get("/student/:studentId", getRegistrationsByStudent);

export default router;