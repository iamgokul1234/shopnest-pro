// src/store/slices/authSlice.js
// Manages authentication state globally

import { createSlice } from "@reduxjs/toolkit";

// ─── Initial State ────────────────────────────────────────────────
// Read from localStorage so state persists on page refresh
const initialState = {
  isLoggedIn: !!localStorage.getItem("token"),
  currentUser: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
};

// ─── Auth Slice ───────────────────────────────────────────────────
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Called after successful login or register
    loginSuccess: (state, action) => {
      const { token, user } = action.payload;

      // Update Redux state
      state.isLoggedIn = true;
      state.currentUser = user;
      state.token = token;

      // Persist to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    },

    // Called on logout
    logoutSuccess: (state) => {
      // Clear Redux state
      state.isLoggedIn = false;
      state.currentUser = null;
      state.token = null;

      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

// ─── Export Actions ───────────────────────────────────────────────
export const { loginSuccess, logoutSuccess } = authSlice.actions;

// ─── Export Selectors ─────────────────────────────────────────────
// Selectors are functions that read state from the store
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectCurrentUser = (state) => state.auth.currentUser;
export const selectToken = (state) => state.auth.token;

export default authSlice.reducer;