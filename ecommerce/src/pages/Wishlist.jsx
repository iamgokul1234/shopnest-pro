/**
 * Wishlist.jsx — User Wishlist Page
 *
 * PHASE 7 UPDATE:
 *  - Uses wishlist and setWishlist props from App.jsx
 *  - All changes update global state immediately
 *  - Navbar count updates without refresh
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaTrash, FaShoppingCart } from 'react-icons/fa';
import Swal from 'sweetalert2';
import api from '../services/api';
import { ROUTES } from '../constants/routes';
import styles from './Wishlist.module.css';

export default function Wishlist({ wishlist, setWishlist, cart, setCart }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ─── Fetch Wishlist On Mount ──────────────────────────────────
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const response = await api.get('/wishlist');
        // Update global wishlist state in App.jsx
        setWishlist(response.data.items);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Failed to load wishlist',
          text: error.response?.data?.message || 'Please try again.',
          confirmButtonColor: '#333',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  // ─── Remove From Wishlist ─────────────────────────────────────
  const handleRemove = async (productId, title) => {
    try {
      const response = await api.delete(`/wishlist/${productId}`);
      // Update global state — Navbar updates immediately
      setWishlist(response.data.items);

      Swal.fire({
        icon: 'success',
        title: 'Removed from Wishlist',
        text: `"${title}" removed.`,
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to remove item',
        text: error.response?.data?.message || 'Please try again.',
        confirmButtonColor: '#333',
      });
    }
  };

  // ─── Move To Cart ─────────────────────────────────────────────
  const handleMoveToCart = async (item) => {
    try {
      // Add to cart
      const cartResponse = await api.post('/cart', {
        productId: parseInt(item.productId),
        title: item.title,
        price: item.price,
        thumbnail: item.thumbnail,
      });

      // Update global cart state
      setCart(cartResponse.data.items);

      // Remove from wishlist
      const wishlistResponse = await api.delete(`/wishlist/${item.productId}`);
      // Update global wishlist state
      setWishlist(wishlistResponse.data.items);

      Swal.fire({
        icon: 'success',
        title: 'Moved to Cart',
        text: `"${item.title}" moved to cart.`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to move to cart',
        text: error.response?.data?.message || 'Please try again.',
        confirmButtonColor: '#333',
      });
    }
  };

  // ─── Clear Wishlist ───────────────────────────────────────────
  const handleClearWishlist = async () => {
    Swal.fire({
      title: 'Clear Wishlist?',
      text: 'Are you sure you want to remove all items?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#333',
      confirmButtonText: 'Yes, clear it',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete('/wishlist');
          // Update global state
          setWishlist([]);

          Swal.fire({
            icon: 'success',
            title: 'Wishlist Cleared',
            timer: 1200,
            showConfirmButton: false,
          });
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Failed to clear wishlist',
            confirmButtonColor: '#333',
          });
        }
      }
    });
  };

  // ─── Loading State ────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '20px' }}>
        Loading wishlist...
      </div>
    );
  }

  return (
    <div className={styles.wishlistPage}>
      <h3 className={styles.heading}>
        <FaHeart style={{ color: '#e53935' }} /> My Wishlist
      </h3>

      {/* ── Empty Wishlist State ──────────────────────────────── */}
      {wishlist.length === 0 ? (
        <div className={styles.emptyWishlist}>
          <FaHeart size={60} style={{ color: '#e0e0e0' }} />
          <p>Your wishlist is empty.</p>
          <button
            className={styles.shopBtn}
            onClick={() => navigate(ROUTES.HOME)}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div>
          {/* ── Wishlist Items ────────────────────────────────── */}
          <div className={styles.wishlistGrid}>
            {wishlist.map((item) => (
              <div key={item.productId} className={styles.wishlistItem}>
                {/* Product Image */}
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className={styles.itemImage}
                />

                {/* Product Details */}
                <div className={styles.itemDetails}>
                  <h4 className={styles.itemTitle}>{item.title}</h4>
                  <p className={styles.itemPrice}>${item.price}</p>
                  <p className={styles.itemRating}>⭐ {item.rating}</p>
                </div>

                {/* Action Buttons */}
                <div className={styles.itemActions}>
                  <button
                    className={styles.moveToCartBtn}
                    onClick={() => handleMoveToCart(item)}
                  >
                    <FaShoppingCart /> Move to Cart
                  </button>
                  <button
                    className={styles.removeBtn}
                    onClick={() => handleRemove(item.productId, item.title)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ── Wishlist Summary ──────────────────────────────── */}
          <div className={styles.wishlistSummary}>
            <p>
              {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} in
              wishlist
            </p>
            <button
              className={styles.clearBtn}
              onClick={handleClearWishlist}
            >
              Clear Wishlist
            </button>
          </div>
        </div>
      )}
    </div>
  );
}