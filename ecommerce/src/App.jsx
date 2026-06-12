/**
 * App.jsx — Root Application Component
 *
 * PHASE 4 UPDATE:
 *  - Loads cart from API on mount when user is logged in
 *  - Cart state is now synced with MongoDB
 */

import { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import AppRoutes from './routes/AppRoutes';
import ErrorBoundary from './components/common/ErrorBoundary';
import api from './services/api';

function App() {
  // ─── Auth State ──────────────────────────────────────────────────
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem('token')
  );
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null
  );

  // ─── Auth Handlers ───────────────────────────────────────────────
  const handleLogin = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setIsLoggedIn(true);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setCurrentUser(null);
    // Clear cart on logout
    setCart([]);
  };

  // ─── Search State ────────────────────────────────────────────────
  const [search, setSearch] = useState('');

  // ─── Cart State ──────────────────────────────────────────────────
  const [cart, setCart] = useState([]);

  // ─── Load Cart From API On Mount ─────────────────────────────────
  // When user is logged in, fetch their cart from MongoDB
  useEffect(() => {
    const loadCart = async () => {
      // Only fetch cart if user is logged in
      if (!localStorage.getItem('token')) return;

      try {
        const response = await api.get('/cart');
        setCart(response.data.items);
      } catch (error) {
        // If cart fetch fails, just start with empty cart
        console.error('Failed to load cart:', error.message);
      }
    };

    loadCart();
  }, [isLoggedIn]); // Re-run when login state changes

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Navbar
          search={search}
          setSearch={setSearch}
          cart={cart}
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
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