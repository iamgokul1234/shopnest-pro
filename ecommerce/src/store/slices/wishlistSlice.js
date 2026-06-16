// src/store/slices/wishlistSlice.js
// Manages wishlist state globally

import { createSlice } from "@reduxjs/toolkit";

// ─── Initial State ────────────────────────────────────────────────
const initialState = {
  items: [],
  totalItems: 0,
};

// ─── Wishlist Slice ───────────────────────────────────────────────
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    // Set entire wishlist (used when loading from API)
    setWishlist: (state, action) => {
      state.items = action.payload;
      state.totalItems = action.payload.length;
    },

    // Clear wishlist (used on logout)
    clearWishlist: (state) => {
      state.items = [];
      state.totalItems = 0;
    },
  },
});

// ─── Export Actions ───────────────────────────────────────────────
export const { setWishlist, clearWishlist } = wishlistSlice.actions;

// ─── Export Selectors ─────────────────────────────────────────────
export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistTotal = (state) => state.wishlist.totalItems;

export default wishlistSlice.reducer;