/**
 * ProtectedRoute.jsx — Route Guard Component
 *
 * WHAT IT DOES:
 *  Wraps around any route that requires the user to be logged in.
 *  If the user is NOT authenticated → redirect to /login automatically.
 *  If the user IS authenticated → render the requested page.
 *
 * CURRENT AUTH CHECK (Phase 1):
 *  Reads from localStorage — checks if a 'user' key exists.
 *  This was set during Register.
 *
 * PHASE 3 UPGRADE:
 *  Will check for a valid JWT token in localStorage instead.
 *  Token expiry will also be validated.
 *
 * HOW TO USE:
 *  In AppRoutes.jsx, wrap any private route:
 *
 *  <Route
 *    path="/cart"
 *    element={
 *      <ProtectedRoute>
 *        <Cart cart={cart} setCart={setCart} />
 *      </ProtectedRoute>
 *    }
 *  />
 *
 *  If user is not logged in and tries to visit /cart,
 *  they will be automatically redirected to /login.
 */

import { Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

export default function ProtectedRoute({ children }) {
  // ─── Auth Check ──────────────────────────────────────────────────
  // Phase 1: Check if user exists in localStorage
  // Phase 3: This will check for a valid, non-expired JWT token
  const user = localStorage.getItem('user');

  // If no user found → redirect to login page
  // <Navigate> is React Router's programmatic redirect component
  // 'replace' replaces the current history entry so user can't
  // press "Back" to get back to the protected page
  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // If user is found → render the protected page normally
  return children;
}
