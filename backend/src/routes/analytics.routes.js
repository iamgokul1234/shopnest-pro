import express from "express";
import { getAnalytics } from "../controllers/analytics.controller.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// GET /api/analytics — get all analytics data
// Admin only — no regular user should see this
router.get("/", protect, adminOnly, getAnalytics);

export default router;
