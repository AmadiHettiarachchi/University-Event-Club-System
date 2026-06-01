import express from "express";
import { testUser, registerUser, loginUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/test", testUser);
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;