import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// ─── Public Routes ────────────────────────────────────────────────
// GET /api/products         — get all products (with search + filter)
router.get("/", getProducts);

// GET /api/products/:id     — get single product
router.get("/:id", getProductById);

// ─── Admin Only Routes ────────────────────────────────────────────
// protect runs first — verifies JWT token
// adminOnly runs second — verifies user is admin

// POST /api/products        — create new product
router.post("/", protect, adminOnly, createProduct);

// PUT /api/products/:id     — update product
router.put("/:id", protect, adminOnly, updateProduct);

// DELETE /api/products/:id  — delete product
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
