import { Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

export default function ProtectedRoute({ children }) {
  // ─── Auth Check ────────────────────────────────────────────────
  // Phase 3: Check for JWT token in localStorage
  // Token is stored during login and register
  // It is removed on logout or when it expires (401 response)
  const token = localStorage.getItem('token');

  // If no token found → redirect to login page
  // replace prevents user from pressing Back to access protected page
  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Token exists → render the protected page
  return children;
}