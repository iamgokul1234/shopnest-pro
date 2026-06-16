import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./components/common/Navbar";
import AppRoutes from "./routes/AppRoutes";
import ErrorBoundary from "./components/common/ErrorBoundary";
import api from "./services/api";

// ─── Redux Actions and Selectors ──────────────────────────────────
import {
  loginSuccess,
  logoutSuccess,
  selectIsLoggedIn,
  selectCurrentUser,
} from "./store/slices/authSlice";
import { setCart, clearCart, selectCartItems } from "./store/slices/cartSlice";
import {
  setWishlist,
  clearWishlist,
  selectWishlistItems,
} from "./store/slices/wishlistSlice";

// ─── Other State ──────────────────────────────────────────────────
import { useState } from "react";

function App() {
  const dispatch = useDispatch();

  // ─── Read State From Redux Store ────────────────────────────────
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const currentUser = useSelector(selectCurrentUser);
  const cart = useSelector(selectCartItems);
  const wishlist = useSelector(selectWishlistItems);

  // ─── Search State (stays local — not needed globally) ───────────
  const [search, setSearch] = useState("");

  // ─── Auth Handlers ───────────────────────────────────────────────
  const handleLogin = (token, user) => {
    dispatch(loginSuccess({ token, user }));
  };

  const handleLogout = () => {
    dispatch(logoutSuccess());
    dispatch(clearCart());
    dispatch(clearWishlist());
  };

  // ─── Cart and Wishlist Setters ───────────────────────────────────
  const setCartItems = (items) => dispatch(setCart(items));
  const setWishlistItems = (items) => dispatch(setWishlist(items));

  // ─── Load Cart And Wishlist From API On Mount ─────────────────────
  useEffect(() => {
    const loadUserData = async () => {
      if (!localStorage.getItem("token")) return;

      try {
        const [cartResponse, wishlistResponse] = await Promise.all([
          api.get("/cart"),
          api.get("/wishlist"),
        ]);

        dispatch(setCart(cartResponse.data.items));
        dispatch(setWishlist(wishlistResponse.data.items));
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
          setCart={setCartItems}
          wishlist={wishlist}
          setWishlist={setWishlistItems}
          onLogin={handleLogin}
        />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
