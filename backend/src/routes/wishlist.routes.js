import express from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../controllers/wishlist.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication

// GET    /api/wishlist           — get user's wishlist
router.get("/", protect, getWishlist);

// POST   /api/wishlist           — add item to wishlist
router.post("/", protect, addToWishlist);

// DELETE /api/wishlist/:productId — remove single item
router.delete("/:productId", protect, removeFromWishlist);

// DELETE /api/wishlist           — clear entire wishlist
router.delete("/", protect, clearWishlist);

export default router;
