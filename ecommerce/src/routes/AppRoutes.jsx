/**
 * AppRoutes.jsx — Centralized Route Definitions
 *
 * PHASE 3 UPDATE:
 *  - Receives onLogin prop from App.jsx
 *  - Passes onLogin to Login and Register pages
 */

import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

// ─── Pages ───────────────────────────────────────────────────────
import Home     from '../pages/Home';
import About    from '../pages/About';
import Contact  from '../pages/Contact';
import Login    from '../pages/Login';
import Register from '../pages/Register';
import Cart     from '../pages/Cart';

// ─── Common Components ────────────────────────────────────────────
import NotFound       from '../components/common/NotFound';
import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes({ search, cart, setCart, onLogin }) {
  return (
    <Routes>
      {/* ── Public Routes ──────────────────────────────────── */}
      <Route
        path={ROUTES.HOME}
        element={<Home search={search} cart={cart} setCart={setCart} />}
      />
      <Route
        path={ROUTES.ABOUT}
        element={<About />}
      />
      <Route
        path={ROUTES.CONTACT}
        element={<Contact />}
      />

      {/* Pass onLogin so pages can update App auth state */}
      <Route
        path={ROUTES.LOGIN}
        element={<Login onLogin={onLogin} />}
      />
      <Route
        path={ROUTES.REGISTER}
        element={<Register onLogin={onLogin} />}
      />

      {/* ── Protected Routes ───────────────────────────────── */}
      <Route
        path={ROUTES.CART}
        element={
          <ProtectedRoute>
            <Cart cart={cart} setCart={setCart} />
          </ProtectedRoute>
        }
      />

      {/* ── 404 ────────────────────────────────────────────── */}
      <Route
        path={ROUTES.NOT_FOUND}
        element={<NotFound />}
      />
    </Routes>
  );
}