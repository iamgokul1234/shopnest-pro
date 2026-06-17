// src/routes/index.js
// Root router — central hub for all API routes

import express from "express";
import authRoutes from "./auth.routes.js";
import cartRoutes from "./cart.routes.js";
import productRoutes from "./product.routes.js";
import userRoutes from "./user.routes.js";
import uploadRoutes from "./upload.routes.js";
import wishlistRoutes from "./wishlist.routes.js";
import reviewRoutes from "./review.routes.js";
import orderRoutes from "./order.routes.js";
import analyticsRoutes from "./analytics.routes.js";

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
router.use("/auth", authRoutes);

// ─── Cart Routes ──────────────────────────────────────────────────
router.use("/cart", cartRoutes);

// ─── Product Routes ───────────────────────────────────────────────
router.use("/products", productRoutes);

// ─── User Routes ──────────────────────────────────────────────────
router.use("/users", userRoutes);

// ─── Upload Routes ────────────────────────────────────────────────
router.use("/upload", uploadRoutes);

// ─── Wishlist Routes ──────────────────────────────────────────────
router.use("/wishlist", wishlistRoutes);

// ─── Review Routes ────────────────────────────────────────────────
router.use("/reviews", reviewRoutes);

// ─── Order Routes ─────────────────────────────────────────────────
router.use("/orders", orderRoutes);

// ─── Analytics Routes ─────────────────────────────────────────────
// GET /api/analytics (admin only)
router.use("/analytics", analyticsRoutes);

export default router;