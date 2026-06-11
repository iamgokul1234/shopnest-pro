/**
 * App.jsx — Root Application Component
 *
 * RESPONSIBILITY:
 *  - Owns the global application state (search, cart)
 *  - Renders the layout shell (Navbar + Routes)
 *  - Wraps everything in BrowserRouter and ErrorBoundary
 *
 * WHAT IT DOES NOT DO:
 *  - Does not define individual routes (that's AppRoutes.jsx)
 *  - Does not contain page logic (that's in src/pages/)
 *  - Does not contain component UI (that's in src/components/)
 *
 * STATE OWNED HERE:
 *  - search  → product search query, passed down to Navbar + Home
 *  - cart    → array of cart items, passed down to Navbar + Cart + Home
 *
 * WHY GLOBAL STATE HERE (and not Redux yet)?
 *  Phase 12 will move cart and auth state to Redux Toolkit.
 *  For now, React's built-in useState is sufficient since state
 *  is only shared between a few components.
 */

import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar      from './components/common/Navbar';
import AppRoutes   from './routes/AppRoutes';
import ErrorBoundary from './components/common/ErrorBoundary';

function App() {
  // ─── Global State ────────────────────────────────────────────────
  // search: the current text in the search bar (synced to Home + Navbar)
  const [search, setSearch] = useState('');

  // cart: array of product objects the user has added
  // Passed to Home (add), Cart (view/remove), Navbar (count badge)
  const [cart, setCart] = useState([]);

  return (
    // ErrorBoundary wraps the entire app
    // If any child crashes, the fallback UI shows instead of a blank screen
    <ErrorBoundary>
      <BrowserRouter>
        {/* Navbar is always visible — outside of Routes */}
        <Navbar search={search} setSearch={setSearch} cart={cart} />

        {/* All route definitions live in AppRoutes */}
        <AppRoutes search={search} cart={cart} setCart={setCart} />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
