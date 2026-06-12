import express from "express";
import {
  register,
  login,
  getMe,
  logout,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Create new account
router.post("/register", register);

//Login and get token
router.post("/login", login);

// ─── Protected Routes ─────────────────────────────────────────────
// These routes require a valid JWT token

//Get current user profile
router.get("/me", protect, getMe);

//Logout current user
router.post("/logout", protect, logout);

export default router;
