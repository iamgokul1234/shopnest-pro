/**
 * Checkout.jsx — Checkout Page
 *
 * PHASE 11 UPDATE:
 *  - Added Razorpay payment integration
 *  - COD and Razorpay both supported
 *  - Payment verification after success
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingBag, FaMapMarkerAlt, FaCreditCard } from 'react-icons/fa';
import Swal from 'sweetalert2';
import api from '../services/api';
import { ROUTES } from '../constants/routes';
import styles from './Checkout.module.css';

// ─── Load Razorpay Script ─────────────────────────────────────────
// Dynamically loads the Razorpay checkout script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

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

  // ─── Handle Razorpay Payment ──────────────────────────────────
  const handleRazorpayPayment = async () => {
    // Load Razorpay script
    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
      Swal.fire({
        icon: 'error',
        title: 'Razorpay Failed',
        text: 'Failed to load Razorpay. Check your internet connection.',
        confirmButtonColor: '#333',
      });
      return;
    }

    try {
      // Create Razorpay order on backend
      const { data } = await api.post('/orders/create-payment', {
        amount: totalPrice,
      });

      // Get current user for prefill
      const user = JSON.parse(localStorage.getItem('user'));

      // Razorpay payment options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: 'ShopNest Pro',
        description: 'Order Payment',
        order_id: data.orderId,
        prefill: {
          name: form.fullName || user?.name,
          contact: form.phone,
        },
        theme: {
          color: '#222222',
        },
        handler: async (response) => {
          // Payment successful — verify on backend
          try {
            const verifyResponse = await api.post('/orders/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              shippingAddress: form,
            });

            // Clear cart
            setCart([]);

            Swal.fire({
              icon: 'success',
              title: 'Payment Successful!',
              text: `Order #${verifyResponse.data.order._id
                .slice(-6)
                .toUpperCase()} placed successfully.`,
              confirmButtonColor: '#333',
            }).then(() => {
              navigate(ROUTES.ORDERS);
            });
          } catch (error) {
            Swal.fire({
              icon: 'error',
              title: 'Payment Verification Failed',
              text: error.response?.data?.message || 'Please contact support.',
              confirmButtonColor: '#333',
            });
          }
        },
        modal: {
          ondismiss: () => {
            Swal.fire({
              icon: 'info',
              title: 'Payment Cancelled',
              text: 'You cancelled the payment.',
              confirmButtonColor: '#333',
            });
          },
        },
      };

      // Open Razorpay payment popup
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Payment Failed',
        text: error.response?.data?.message || 'Please try again.',
        confirmButtonColor: '#333',
      });
    }
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

    // Validate form
    if (
      !form.fullName ||
      !form.phone ||
      !form.address ||
      !form.city ||
      !form.state ||
      !form.pincode
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Address',
        text: 'Please fill in all shipping address fields.',
        confirmButtonColor: '#333',
      });
      return;
    }

    if (paymentMethod === 'razorpay') {
      // Handle Razorpay payment
      await handleRazorpayPayment();
      return;
    }

    // Handle COD
    setLoading(true);

    try {
      const response = await api.post('/orders', {
        shippingAddress: form,
        paymentMethod,
      });

      setCart([]);

      Swal.fire({
        icon: 'success',
        title: 'Order Placed!',
        text: `Your order #${response.data.order._id
          .slice(-6)
          .toUpperCase()} has been placed successfully.`,
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
              <h3 className={styles.sectionTitle}>
                <FaCreditCard /> Payment Method
              </h3>

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

                <label className={styles.paymentOption}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>
                    Pay Online with Razorpay
                    <span className={styles.testBadge}>TEST MODE</span>
                  </span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className={styles.placeOrderBtn}
              disabled={loading}
            >
              {loading
                ? 'Placing Order...'
                : paymentMethod === 'razorpay'
                ? 'Pay Now'
                : 'Place Order'}
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