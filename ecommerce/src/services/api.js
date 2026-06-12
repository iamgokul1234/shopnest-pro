import axios from "axios";
import { ROUTES } from "../constants/routes";

// ─── Instance 1: Our Backend API ─────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request Interceptor ──────────────────────────────────────────
// Automatically attaches JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response Interceptor ─────────────────────────────────────────
// Handles global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        // Only redirect if we are NOT on an auth route
        // This prevents swallowing login/register error messages
        const currentPath = window.location.pathname;
        const isAuthRoute =
          currentPath.includes("/login") || currentPath.includes("/register");

        if (!isAuthRoute) {
          // Token expired on a protected route — clear and redirect
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = ROUTES.LOGIN;
        }
      }

      if (status === 500) {
        console.error("Server error. Please try again later.");
      }
    } else if (error.request) {
      console.error("Network error. Check your internet connection.");
    }

    return Promise.reject(error);
  },
);

// ─── Instance 2: DummyJSON API ────────────────────────────────────
// Used for product data until Phase 5 (when we build our own products)
export const dummyApi = axios.create({
  baseURL: import.meta.env.VITE_DUMMYJSON_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
