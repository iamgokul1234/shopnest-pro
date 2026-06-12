// src/routes/index.js
// Root router — central hub for all API routes

import express from "express";
import authRoutes from "./auth.routes.js";
import cartRoutes from "./cart.routes.js";
import productRoutes from "./product.routes.js";
import userRoutes from "./user.routes.js";

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

// ─── Product Routes ───────────────────────────────────────────────
// GET    /api/products
// GET    /api/products/:id
// POST   /api/products        (admin only)
// PUT    /api/products/:id    (admin only)
// DELETE /api/products/:id    (admin only)
router.use("/products", productRoutes);

// ─── User Routes ──────────────────────────────────────────────────
// GET    /api/users           (admin only)
// GET    /api/users/:id       (admin only)
// PUT    /api/users/:id       (admin only)
// DELETE /api/users/:id       (admin only)
router.use("/users", userRoutes);

export default router;
