/**
 * Cart.jsx — Shopping Cart Page
 *
 * PHASE 10 UPDATE:
 *  - Added checkout button
 *  - Navigates to checkout page
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoCart } from "react-icons/io5";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import Swal from "sweetalert2";
import api from "../services/api";
import { ROUTES } from "../constants/routes";
import styles from "./Cart.module.css";

export default function Cart({ cart = [], setCart = () => {} }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ─── Calculate Total Price ────────────────────────────────────────
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // ─── Remove Item From Cart ────────────────────────────────────────
  const handleRemove = async (productId, title) => {
    try {
      setLoading(true);
      const response = await api.delete(`/cart/${productId}`);
      setCart(response.data.items);

      Swal.fire({
        icon: "success",
        title: "Removed",
        text: `"${title}" removed from cart.`,
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to remove item",
        text: error.response?.data?.message || "Please try again.",
        confirmButtonColor: "#333",
      });
    } finally {
      setLoading(false);
    }
  };

  // ─── Update Item Quantity ─────────────────────────────────────────
  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      setLoading(true);
      const response = await api.put(`/cart/${productId}`, {
        quantity: newQuantity,
      });
      setCart(response.data.items);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to update quantity",
        text: error.response?.data?.message || "Please try again.",
        confirmButtonColor: "#333",
      });
    } finally {
      setLoading(false);
    }
  };

  // ─── Clear Entire Cart ────────────────────────────────────────────
  const handleClearCart = async () => {
    Swal.fire({
      title: "Clear Cart?",
      text: "Are you sure you want to remove all items?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#333",
      confirmButtonText: "Yes, clear it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          await api.delete("/cart");
          setCart([]);

          Swal.fire({
            icon: "success",
            title: "Cart Cleared",
            timer: 1200,
            showConfirmButton: false,
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Failed to clear cart",
            text: error.response?.data?.message || "Please try again.",
            confirmButtonColor: "#333",
          });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  return (
    <div className={styles.cartPage}>
      <h3 className={styles.heading}>
        <IoCart /> Cart
      </h3>

      {/* ── Empty Cart State ──────────────────────────────────── */}
      {cart.length === 0 ? (
        <div className={styles.emptyCart}>
          <p>Your cart is empty!</p>
          <img
            src="empty_cart.png"
            alt="Empty cart illustration"
            className={styles.emptyImage}
          />
        </div>
      ) : (
        <div>
          {/* ── Cart Items ────────────────────────────────────── */}
          <div className={styles.cartGrid}>
            {cart.map((item) => (
              <div key={item.productId} className={styles.cartItem}>
                {/* Product Image */}
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className={styles.cartImage}
                />

                {/* Product Details */}
                <div className={styles.cartDetails}>
                  <h4 className={styles.cartTitle}>{item.title}</h4>
                  <p className={styles.cartPrice}>
                    ${item.price} × {item.quantity} = $
                    {(item.price * item.quantity).toFixed(2)}
                  </p>

                  {/* Quantity Controls */}
                  <div className={styles.quantityControls}>
                    <button
                      className={styles.quantityBtn}
                      onClick={() =>
                        handleQuantityChange(item.productId, item.quantity - 1)
                      }
                      disabled={loading || item.quantity <= 1}
                    >
                      <FaMinus />
                    </button>

                    <span className={styles.quantity}>{item.quantity}</span>

                    <button
                      className={styles.quantityBtn}
                      onClick={() =>
                        handleQuantityChange(item.productId, item.quantity + 1)
                      }
                      disabled={loading}
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  className={styles.removeBtn}
                  onClick={() => handleRemove(item.productId, item.title)}
                  disabled={loading}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          {/* ── Cart Summary ──────────────────────────────────── */}
          <div className={styles.cartSummary}>
            <h3 className={styles.totalPrice}>
              Total: ${totalPrice.toFixed(2)}
            </h3>
            <div className={styles.cartActions}>
              <button
                className={styles.clearBtn}
                onClick={handleClearCart}
                disabled={loading}
              >
                Clear Cart
              </button>
              <button
                className={styles.checkoutBtn}
                onClick={() => navigate(ROUTES.CHECKOUT)}
                disabled={loading}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}