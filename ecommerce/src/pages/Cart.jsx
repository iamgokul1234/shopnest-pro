/**
 * Cart.jsx — Shopping Cart Page
 *
 * RESPONSIBILITY:
 *  Displays all products the user has added to their cart.
 *  Allows removing individual items.
 *
 * PROPS:
 *  - cart    {array}    The current cart items (owned by App.jsx)
 *  - setCart {function} Updates cart state in App.jsx
 *
 * NOTE:
 *  Phase 4 will replace this with a persistent cart backed by MongoDB.
 *  Currently cart lives in React state and clears on page refresh.
 */

import { IoCart } from 'react-icons/io5';
import ProductCard from '../components/product/ProductCard';
import styles from './Cart.module.css';

export default function Cart({ cart = [], setCart = () => {} }) {

  // ─── Remove Item From Cart ──────────────────────────────────────
  const handleRemoveFromCart = (id) => {
    // Filter out the item whose id matches the one to remove
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
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
          {/* empty_cart.png lives in /public — accessible via root path */}
          <img src="empty_cart.png" alt="Empty cart illustration" className={styles.emptyImage} />
        </div>
      ) : (
        /* ── Cart Items Grid ──────────────────────────────────── */
        <div className={styles.cartGrid}>
          {cart.map((item) => (
            <ProductCard
              key={item.id}
              title={item.title}
              description={`Price: $${item.price} | Rating: ${item.rating}`}
              image={item.thumbnail}
              onAction={() => handleRemoveFromCart(item.id)}
              actionLabel="Remove"
            />
          ))}
        </div>
      )}
    </div>
  );
}
