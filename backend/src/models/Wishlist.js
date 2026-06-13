import mongoose from "mongoose";

// ─── Wishlist Item Schema ─────────────────────────────────────────
const wishlistItemSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: [true, "Product ID is required"],
    },
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    thumbnail: {
      type: String,
      required: [true, "Product thumbnail is required"],
    },
    rating: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false, // No separate _id for each item
  },
);

// ─── Wishlist Schema ──────────────────────────────────────────────
const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one wishlist per user
    },
    items: [wishlistItemSchema],
  },
  {
    timestamps: true,
  },
);

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

export default Wishlist;
