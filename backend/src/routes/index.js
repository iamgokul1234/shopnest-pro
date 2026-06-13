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
// GET    /api/reviews/:productId
// POST   /api/reviews/:productId
// DELETE /api/reviews/:id
router.use("/reviews", reviewRoutes);

// Future routes
// router.use("/orders", orderRoutes);

export default router;