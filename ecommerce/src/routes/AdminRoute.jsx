/**
 * AdminRoute.jsx — Admin Only Route Guard
 *
 * Checks two things before allowing access:
 * 1. Is the user logged in? (has token)
 * 2. Is the user an admin? (role === 'admin')
 *
 * If not logged in → redirect to /login
 * If logged in but not admin → redirect to /home
 
 */

import { Navigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Not logged in → redirect to login
  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Logged in but not admin → redirect to home
  if (!user || user.role !== "admin") {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  // User is admin → render the admin page
  return children;
}
