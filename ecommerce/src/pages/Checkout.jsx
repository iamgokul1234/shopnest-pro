/**
 * Checkout.jsx — Checkout Page
 *
 * FEATURES:
 *  - Shows order summary from cart
 *  - Collects shipping address
 *  - Payment method selection (COD for now, Razorpay in Phase 11)
 *  - Places order via API
 *  - Clears cart after successful order
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingBag, FaMapMarkerAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import api from '../services/api';
import { ROUTES } from '../constants/routes';
import styles from './Checkout.module.css';

export default function Checkout({ cart, setCart }) {
  const navigate = useNavigate();

  // ─── Shipping Form State ──────────────────────────────────────
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);

  // ─── Calculate Total ──────────────────────────────────────────
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // ─── Handle Form Change ───────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // ─── Place Order ──────────────────────────────────────────────
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Cart is empty',
        text: 'Please add items to your cart first.',
        confirmButtonColor: '#333',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/orders', {
        shippingAddress: form,
        paymentMethod,
      });

      // Clear cart state after order
      setCart([]);

      Swal.fire({
        icon: 'success',
        title: 'Order Placed!',
        text: `Your order #${response.data.order._id.slice(-6).toUpperCase()} has been placed successfully.`,
        confirmButtonColor: '#333',
      }).then(() => {
        navigate(ROUTES.ORDERS);
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to place order',
        text: error.response?.data?.message || 'Please try again.',
        confirmButtonColor: '#333',
      });
    } finally {
      setLoading(false);
    }
  };

  // ─── Empty Cart Check ─────────────────────────────────────────
  if (cart.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <FaShoppingBag size={60} style={{ color: '#e0e0e0' }} />
        <p>Your cart is empty.</p>
        <button
          className={styles.shopBtn}
          onClick={() => navigate(ROUTES.HOME)}
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className={styles.checkoutPage}>
      <h2 className={styles.heading}>Checkout</h2>

      <div className={styles.checkoutLayout}>
        {/* ── Shipping Form ────────────────────────────────── */}
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>
            <FaMapMarkerAlt /> Shipping Address
          </h3>

          <form onSubmit={handlePlaceOrder} className={styles.form}>
            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  className={styles.input}
                  placeholder="Enter your full name"
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className={styles.input}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>Address</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  className={styles.input}
                  placeholder="House no, Street, Area"
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>City</label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                  className={styles.input}
                  placeholder="City"
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>State</label>
                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  required
                  className={styles.input}
                  placeholder="State"
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  required
                  className={styles.input}
                  placeholder="Pincode"
                  maxLength={6}
                />
              </div>
            </div>

            {/* ── Payment Method ──────────────────────────── */}
            <div className={styles.paymentSection}>
              <h3 className={styles.sectionTitle}>Payment Method</h3>

              <div className={styles.paymentOptions}>
                <label className={styles.paymentOption}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Cash on Delivery</span>
                </label>

                <label
                  className={`${styles.paymentOption} ${styles.disabledOption}`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    disabled
                  />
                  <span>Razorpay (Coming in Phase 11)</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className={styles.placeOrderBtn}
              disabled={loading}
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>

        {/* ── Order Summary ────────────────────────────────── */}
        <div className={styles.summarySection}>
          <h3 className={styles.sectionTitle}>Order Summary</h3>

          <div className={styles.summaryItems}>
            {cart.map((item) => (
              <div key={item.productId} className={styles.summaryItem}>
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className={styles.summaryImage}
                />
                <div className={styles.summaryDetails}>
                  <p className={styles.summaryTitle}>{item.title}</p>
                  <p className={styles.summaryPrice}>
                    ${item.price} × {item.quantity} = $
                    {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.summaryTotal}>
            <span>Total</span>
            <span className={styles.totalAmount}>
              ${totalPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}