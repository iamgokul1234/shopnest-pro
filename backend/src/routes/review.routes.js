// src/routes/review.routes.js
// Review route definitions

import express from "express";
import {
  getProductReviews,
  addReview,
  deleteReview,
} from "../controllers/review.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// ─── Public Routes ────────────────────────────────────────────────
// GET /api/reviews/:productId — get all reviews for a product
router.get("/:productId", getProductReviews);

// ─── Protected Routes ─────────────────────────────────────────────
// POST /api/reviews/:productId — add a review
router.post("/:productId", protect, addReview);

// DELETE /api/reviews/:id — delete own review
router.delete("/:id", protect, deleteReview);

export default router;