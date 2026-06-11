/**
 * api.js — Centralized Axios Instance
 *
 * This file creates a single, pre-configured Axios instance that all
 * API calls in the app will use.
 *
 * WHY A SINGLE INSTANCE:
 *  - Base URL is set once — no repetition across files
 *  - Auth headers can be injected automatically via interceptors
 *  - Errors can be handled globally in one place
 *  - Timeouts, headers, and settings configured once
 *
 * PHASES:
 *  Phase 1 → Uses DummyJSON for products (no auth needed yet)
 *  Phase 2 → baseURL switches to our own Express backend
 *  Phase 3 → Request interceptor adds JWT token to every request
 */

import axios from 'axios';

// ─── Create The Axios Instance ────────────────────────────────────────────────

const api = axios.create({
  // baseURL comes from .env file — never hardcoded
  // All relative URLs will be prefixed with this
  // Example: api.get('/products') → GET https://dummyjson.com/products
  baseURL: import.meta.env.VITE_API_BASE_URL,

  // Timeout: If a request takes longer than 10 seconds, cancel it
  // This prevents the app from hanging forever on a slow network
  timeout: 10000,

  // Default headers sent with every request
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor ─────────────────────────────────────────────────────
// This runs BEFORE every request is sent.
// In Phase 3, we will add: Authorization: Bearer <JWT_TOKEN> here automatically

api.interceptors.request.use(
  (config) => {
    // Phase 3 will add this:
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    // If there's an error setting up the request, reject it
    return Promise.reject(error);
  }
);

// ─── Response Interceptor ────────────────────────────────────────────────────
// This runs AFTER every response is received.
// We use it to handle global errors like 401 Unauthorized, 500 Server Error.

api.interceptors.response.use(
  (response) => {
    // If the response is successful (2xx), just return it as-is
    return response;
  },
  (error) => {
    // If the server returns an error:
    if (error.response) {
      // The server responded but with an error status code (4xx, 5xx)
      const status = error.response.status;

      if (status === 401) {
        // 401 = Unauthorized — user's token is invalid or expired
        // Phase 3: We will redirect to /login and clear localStorage here
        console.warn('Session expired. Please log in again.');
      }

      if (status === 500) {
        // 500 = Internal Server Error — something broke on the backend
        console.error('Server error. Please try again later.');
      }
    } else if (error.request) {
      // The request was sent but no response was received
      // This means the server is down or there's a network issue
      console.error('Network error. Check your internet connection.');
    }

    // Always reject the promise so individual components can handle errors too
    return Promise.reject(error);
  }
);

export default api;
