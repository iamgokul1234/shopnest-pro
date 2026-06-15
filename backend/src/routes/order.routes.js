// src/routes/order.routes.js
// Order route definitions

import express from "express";
import {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// ─── Protected Routes ─────────────────────────────────────────────

// POST /api/orders          — place new order
router.post("/", protect, placeOrder);

// GET  /api/orders/my       — get my orders
// IMPORTANT: /my must come BEFORE /:id
// otherwise Express will treat "my" as an id parameter
router.get("/my", protect, getMyOrders);

// GET  /api/orders/:id      — get single order
router.get("/:id", protect, getOrderById);

// ─── Admin Only Routes ────────────────────────────────────────────

// GET  /api/orders          — get all orders
router.get("/", protect, adminOnly, getAllOrders);

// PUT  /api/orders/:id/status — update order status
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

export default router;