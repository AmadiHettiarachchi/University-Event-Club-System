import express from "express";
import { getClubs, createClub } from "../controllers/clubController.js";

const router = express.Router();

router.get("/", getClubs);
router.post("/", createClub);

export default router;