// src/controllers/user.controller.js
// Handles admin user management operations

import User from "../models/User.js";

// ─── @route   GET /api/users ──────────────────────────────────────
// @desc    Get all users
// @access  Admin only
export const getUsers = async (req, res) => {
  // Never return passwords — select: false handles this automatically
  // but we explicitly exclude it here for clarity
  const users = await User.find({}).select("-password");

  res.status(200).json({
    success: true,
    total: users.length,
    users,
  });
};

// ─── @route   GET /api/users/:id ─────────────────────────────────
// @desc    Get single user by ID
// @access  Admin only
export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    success: true,
    user,
  });
};

// ─── @route   PUT /api/users/:id ─────────────────────────────────
// @desc    Update user role
// @access  Admin only
export const updateUserRole = async (req, res) => {
  const { role } = req.body;

  // Validate role value
  if (!role || !["user", "admin"].includes(role)) {
    res.status(400);
    throw new Error("Role must be either 'user' or 'admin'");
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Prevent admin from changing their own role
  if (user._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error("You cannot change your own role");
  }

  user.role = role;
  await user.save();

  res.status(200).json({
    success: true,
    message: `User role updated to ${role}`,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

// ─── @route   DELETE /api/users/:id ──────────────────────────────
// @desc    Delete a user
// @access  Admin only
export const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Prevent admin from deleting themselves
  if (user._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error("You cannot delete your own account");
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
};