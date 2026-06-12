import express from "express";
import authRoutes from "./auth.routes.js";

const router = express.Router();

// ─── Health Check ─────────────────────────────────────────────────
// verify the API is running
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

export default router;
