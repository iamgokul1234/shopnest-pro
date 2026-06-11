/**
 * routes.js — Route Path Constants
 *
 * All route paths for the application are defined here as constants.
 *
 * WHY:
 *  - Single source of truth for all paths
 *  - If a path changes, update it here ONLY — nowhere else
 *  - Prevents typos (e.g., "/Cart" vs "/cart")
 *  - Makes refactoring safe and fast
 *
 * HOW TO USE:
 *  import { ROUTES } from '../constants/routes';
 *  <Link to={ROUTES.HOME}>Home</Link>
 *  navigate(ROUTES.LOGIN);
 */

export const ROUTES = {
  // Public routes — accessible by everyone
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  LOGIN: '/login',
  REGISTER: '/register',

  // Protected routes — only accessible when logged in
  CART: '/cart',

  // Admin routes — only accessible by admin users (Phase 5)
  ADMIN: '/admin',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_USERS: '/admin/users',
  ADMIN_ORDERS: '/admin/orders',

  // Error route
  NOT_FOUND: '*',
};
