import { Routes, Route } from "react-router-dom";
import { ROUTES } from "../constants/routes";

// ─── Pages ───────────────────────────────────────────────────────
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Cart from "../pages/Cart";
import Wishlist from "../pages/Wishlist";
import AdminDashboard from "../pages/AdminDashboard";
import ProductDetail from "../pages/ProductDetail";

// ─── Route Guards ─────────────────────────────────────────────────
import NotFound from "../components/common/NotFound";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

export default function AppRoutes({
  search,
  cart,
  setCart,
  wishlist,
  setWishlist,
  onLogin,
}) {
  return (
    <Routes>
      {/* ── Public Routes ──────────────────────────────────── */}
      <Route
        path={ROUTES.HOME}
        element={
          <Home
            search={search}
            cart={cart}
            setCart={setCart}
            wishlist={wishlist}
            setWishlist={setWishlist}
          />
        }
      />
      <Route path={ROUTES.ABOUT} element={<About />} />
      <Route path={ROUTES.CONTACT} element={<Contact />} />
      <Route path={ROUTES.LOGIN} element={<Login onLogin={onLogin} />} />
      <Route path={ROUTES.REGISTER} element={<Register onLogin={onLogin} />} />

      {/* Product Detail Page */}
      <Route
        path={ROUTES.PRODUCT_DETAIL}
        element={<ProductDetail cart={cart} setCart={setCart} />}
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
      <Route
        path={ROUTES.WISHLIST}
        element={
          <ProtectedRoute>
            <Wishlist
              wishlist={wishlist}
              setWishlist={setWishlist}
              cart={cart}
              setCart={setCart}
            />
          </ProtectedRoute>
        }
      />

      {/* ── Admin Routes ───────────────────────────────────── */}
      <Route
        path={ROUTES.ADMIN}
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      {/* ── 404 ────────────────────────────────────────────── */}
      <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
    </Routes>
  );
}
