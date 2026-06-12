
import mongoose from "mongoose";

// ─── Cart Item Schema ─────────────────────────────────────────────
// This is a sub-schema for each item inside the cart
const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: Number,
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
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: [1, "Quantity must be at least 1"],
    },
  },
  {
    // _id: false means each cart item does NOT get its own _id
    // We use productId to identify items instead
    _id: false,
  }
);

// ─── Cart Schema ──────────────────────────────────────────────────
const cartSchema = new mongoose.Schema(
  {
    // user field links this cart to a specific user
    // ref: 'User' allows mongoose to populate user details if needed
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one cart per user
    },

    // items is an array of cartItemSchema objects
    items: [cartItemSchema],
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;