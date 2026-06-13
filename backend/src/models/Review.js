// src/models/Review.js
// MongoDB schema for product reviews

import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    // User who wrote the review
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Store user name to display even if user is deleted
    userName: {
      type: String,
      required: true,
    },

    // Product being reviewed
    // String because it can be DummyJSON id or our own MongoDB id
    productId: {
      type: String,
      required: [true, "Product ID is required"],
    },

    // Store product title for display purposes
    productTitle: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
    },

    // Star rating 1 to 5
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },

    // Review text
    comment: {
      type: String,
      required: [true, "Review comment is required"],
      trim: true,
      minlength: [10, "Review must be at least 10 characters"],
      maxlength: [500, "Review cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// ─── Prevent Duplicate Reviews ────────────────────────────────────
// One user can only review each product once
reviewSchema.index({ user: 1, productId: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);

export default Review;