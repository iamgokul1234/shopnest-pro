// src/routes/upload.routes.js
// Image upload route — streams file from memory to Cloudinary

import express from "express";
import upload from "../middleware/upload.js";
import cloudinary from "../config/cloudinary.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// ─── @route   POST /api/upload ────────────────────────────────────
// @desc    Upload a single image to Cloudinary
// @access  Admin only
router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"),
  async (req, res) => {
    // Check if file was provided
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Upload file buffer to Cloudinary using upload_stream
    // This streams the file from memory directly to Cloudinary
    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "shopnest-pro/products",
            transformation: [{ width: 800, crop: "limit" }],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        // Write the file buffer to the stream
        stream.end(req.file.buffer);
      });
    };

    const result = await uploadToCloudinary();

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: result.secure_url,
    });
  }
);

export default router;