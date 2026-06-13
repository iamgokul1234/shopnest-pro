// src/middleware/upload.js
// Multer middleware using memory storage
// Files are held in memory then streamed to Cloudinary

import multer from "multer";

// ─── Memory Storage ───────────────────────────────────────────────
// Instead of saving to disk or Cloudinary directly,
// multer stores the file in memory as a Buffer
// We then manually upload to Cloudinary in the route handler
const storage = multer.memoryStorage();

// ─── File Filter ──────────────────────────────────────────────────
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

// ─── Multer Instance ──────────────────────────────────────────────
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB max
  },
});

export default upload;