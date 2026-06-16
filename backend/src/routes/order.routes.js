// src/routes/order.routes.js
// Order route definitions

import express from "express";
import {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  createPayment,
  verifyPayment,
} from "../controllers/order.controller.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// ─── Payment Routes ───────────────────────────────────────────────
// IMPORTANT: These must come BEFORE /:id routes
// otherwise Express will treat "create-payment" as an id

// POST /api/orders/create-payment — create Razorpay order
router.post("/create-payment", protect, createPayment);

// POST /api/orders/verify-payment — verify payment and place order
router.post("/verify-payment", protect, verifyPayment);

// ─── Protected Routes ─────────────────────────────────────────────

// POST /api/orders          — place new order (COD)
router.post("/", protect, placeOrder);

// GET  /api/orders/my       — get my orders
// IMPORTANT: /my must come BEFORE /:id
router.get("/my", protect, getMyOrders);

// GET  /api/orders/:id      — get single order
router.get("/:id", protect, getOrderById);

// ─── Admin Only Routes ────────────────────────────────────────────

// GET  /api/orders          — get all orders
router.get("/", protect, adminOnly, getAllOrders);

// PUT  /api/orders/:id/status — update order status
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

export default router;