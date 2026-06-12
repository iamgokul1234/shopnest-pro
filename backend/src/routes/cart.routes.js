import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cart.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// GET  /api/cart          — get user's cart
router.get("/", protect, getCart);

// POST /api/cart          — add item to cart
router.post("/", protect, addToCart);

// PUT  /api/cart/:productId — update item quantity
router.put("/:productId", protect, updateCartItem);

// DELETE /api/cart/:productId — remove single item
router.delete("/:productId", protect, removeFromCart);

// DELETE /api/cart        — clear entire cart
router.delete("/", protect, clearCart);

export default router;
