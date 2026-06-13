// src/routes/index.js
// Root router — central hub for all API routes

import express from "express";
import authRoutes from "./auth.routes.js";
import cartRoutes from "./cart.routes.js";
import productRoutes from "./product.routes.js";
import userRoutes from "./user.routes.js";
import uploadRoutes from "./upload.routes.js";
import wishlistRoutes from "./wishlist.routes.js";

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
// GET    /api/wishlist
// POST   /api/wishlist
// DELETE /api/wishlist/:productId
// DELETE /api/wishlist
router.use("/wishlist", wishlistRoutes);

export default router;