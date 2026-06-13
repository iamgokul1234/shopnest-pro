import { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import AppRoutes from "./routes/AppRoutes";
import ErrorBoundary from "./components/common/ErrorBoundary";
import api from "./services/api";

function App() {
  // ─── Auth State ──────────────────────────────────────────────────
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null,
  );

  // ─── Auth Handlers ───────────────────────────────────────────────
  const handleLogin = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setIsLoggedIn(true);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCart([]);
    setWishlist([]);
  };

  // ─── Search State ────────────────────────────────────────────────
  const [search, setSearch] = useState("");

  // ─── Cart State ──────────────────────────────────────────────────
  const [cart, setCart] = useState([]);

  // ─── Wishlist State ──────────────────────────────────────────────
  const [wishlist, setWishlist] = useState([]);

  // ─── Load Cart And Wishlist From API On Mount ─────────────────────
  useEffect(() => {
    const loadUserData = async () => {
      if (!localStorage.getItem("token")) return;

      try {
        // Load cart and wishlist simultaneously
        const [cartResponse, wishlistResponse] = await Promise.all([
          api.get("/cart"),
          api.get("/wishlist"),
        ]);

        setCart(cartResponse.data.items);
        setWishlist(wishlistResponse.data.items);
      } catch (error) {
        console.error("Failed to load user data:", error.message);
      }
    };

    loadUserData();
  }, [isLoggedIn]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Navbar
          search={search}
          setSearch={setSearch}
          cart={cart}
          wishlist={wishlist}
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
        <AppRoutes
          search={search}
          cart={cart}
          setCart={setCart}
          wishlist={wishlist}
          setWishlist={setWishlist}
          onLogin={handleLogin}
        />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
