/**
 * App.jsx — Root Application Component
 *
 * PHASE 3 UPDATE:
 *  - Now owns auth state (isLoggedIn, currentUser)
 *  - Passes auth state and handlers down to Navbar and Routes
 *  - When login/logout happens anywhere, Navbar updates immediately
 */

import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import AppRoutes from './routes/AppRoutes';
import ErrorBoundary from './components/common/ErrorBoundary';

function App() {
  // ─── Auth State ──────────────────────────────────────────────────
  // Owned here so Navbar and Pages share the same source of truth
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem('token')
  );
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null
  );

  // ─── Auth Handlers ───────────────────────────────────────────────
  // Called by Login.jsx and Register.jsx after successful auth
  const handleLogin = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setIsLoggedIn(true);
    setCurrentUser(user);
  };

  // Called by Navbar logout button
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  // ─── Search State ────────────────────────────────────────────────
  const [search, setSearch] = useState('');

  // ─── Cart State ──────────────────────────────────────────────────
  const [cart, setCart] = useState([]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        {/* Navbar receives auth state and logout handler */}
        <Navbar
          search={search}
          setSearch={setSearch}
          cart={cart}
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        {/* Routes receive login handler to call after successful auth */}
        <AppRoutes
          search={search}
          cart={cart}
          setCart={setCart}
          onLogin={handleLogin}
        />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;