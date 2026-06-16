// src/store/slices/cartSlice.js
// Manages shopping cart state globally

import { createSlice } from "@reduxjs/toolkit";

// ─── Initial State ────────────────────────────────────────────────
const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

// ─── Helper: Calculate Totals ─────────────────────────────────────
const calculateTotals = (items) => {
  return {
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice:
      Math.round(
        items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100
      ) / 100,
  };
};

// ─── Cart Slice ───────────────────────────────────────────────────
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Set entire cart (used when loading from API)
    setCart: (state, action) => {
      state.items = action.payload;
      const totals = calculateTotals(action.payload);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
    },

    // Clear cart (used on logout or after order)
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
    },
  },
});

// ─── Export Actions ───────────────────────────────────────────────
export const { setCart, clearCart } = cartSlice.actions;

// ─── Export Selectors ─────────────────────────────────────────────
export const selectCartItems = (state) => state.cart.items;
export const selectTotalItems = (state) => state.cart.totalItems;
export const selectTotalPrice = (state) => state.cart.totalPrice;

export default cartSlice.reducer;