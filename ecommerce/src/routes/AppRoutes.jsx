/**
 * AppRoutes.jsx — Centralized Route Definitions
 *
 * RESPONSIBILITY:
 *  Defines ALL routes for the application in one place.
 *  Separates routing logic from the App layout component.
 *
 * ROUTE TYPES:
 *  1. Public Routes     — accessible by anyone
 *  2. Protected Routes  — wrapped in <ProtectedRoute>, redirect to login if not authenticated
 *  3. Catch-All Route   — the "*" path renders 404 for unknown URLs
 *
 * ADDING A NEW ROUTE:
 *  1. Add the path to src/constants/routes.js
 *  2. Create the page component in src/pages/
 *  3. Add a <Route> here
 *  4. If private, wrap with <ProtectedRoute>
 */

import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

// ─── Pages ───────────────────────────────────────────────────────────────────
import Home     from '../pages/Home';
import About    from '../pages/About';
import Contact  from '../pages/Contact';
import Login    from '../pages/Login';
import Register from '../pages/Register';
import Cart     from '../pages/Cart';

// ─── Common Components ────────────────────────────────────────────────────────
import NotFound      from '../components/common/NotFound';
import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes({ search, cart, setCart }) {
  return (
    <Routes>
      {/* ── Public Routes — No login required ──────────────────── */}

      {/* Home page — shows product grid */}
      <Route
        path={ROUTES.HOME}
        element={<Home search={search} cart={cart} setCart={setCart} />}
      />

      {/* About page — static info page */}
      <Route
        path={ROUTES.ABOUT}
        element={<About />}
      />

      {/* Contact page — email form */}
      <Route
        path={ROUTES.CONTACT}
        element={<Contact />}
      />

      {/* Login page */}
      <Route
        path={ROUTES.LOGIN}
        element={<Login />}
      />

      {/* Register page */}
      <Route
        path={ROUTES.REGISTER}
        element={<Register />}
      />

      {/* ── Protected Routes — Login required ──────────────────── */}

      {/* Cart page — only accessible when logged in */}
      <Route
        path={ROUTES.CART}
        element={
          <ProtectedRoute>
            <Cart cart={cart} setCart={setCart} />
          </ProtectedRoute>
        }
      />

      {/* ── Catch-All Route — 404 ──────────────────────────────── */}
      {/* The "*" path matches ANY URL that didn't match above */}
      <Route
        path={ROUTES.NOT_FOUND}
        element={<NotFound />}
      />
    </Routes>
  );
}
