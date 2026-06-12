import express from "express";
import {
  getUsers,
  getUserById,
  updateUserRole,
  deleteUser,
} from "../controllers/user.controller.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// All routes below require authentication AND admin role
// protect → verify JWT token
// adminOnly → verify user is admin

// GET /api/users            — get all users
router.get("/", protect, adminOnly, getUsers);

// GET /api/users/:id        — get single user
router.get("/:id", protect, adminOnly, getUserById);

// PUT /api/users/:id        — update user role
router.put("/:id", protect, adminOnly, updateUserRole);

// DELETE /api/users/:id     — delete user
router.delete("/:id", protect, adminOnly, deleteUser);

export default router;
