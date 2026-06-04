import express from "express";
import {
  testUser,
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/test", testUser);
router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile/:id", getUserProfile);
router.put("/profile/:id", updateUserProfile);

export default router;