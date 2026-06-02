import express from "express";
import {
  registerForEvent,
  getRegistrationsByClub,
} from "../controllers/eventRegistrationController.js";

const router = express.Router();

router.post("/", registerForEvent);
router.get("/club/:club", getRegistrationsByClub);

export default router;