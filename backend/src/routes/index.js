// src/routes/index.js
// Root router — central hub for all API routes

import express from "express";
import authRoutes from "./auth.routes.js";
import cartRoutes from "./cart.routes.js";

const router = express.Router();

// ─── Health Check ─────────────────────────────────────────────────
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ShopNest Pro API is running",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── Auth Routes ──────────────────────────────────────────────────
// POST /api/auth/register
// POST /api/auth/login
// GET  /api/auth/me
// POST /api/auth/logout
router.use("/auth", authRoutes);

// ─── Cart Routes ──────────────────────────────────────────────────
// GET    /api/cart
// POST   /api/cart
// PUT    /api/cart/:productId
// DELETE /api/cart/:productId
// DELETE /api/cart
router.use("/cart", cartRoutes);

export default router;