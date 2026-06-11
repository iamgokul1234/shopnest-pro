/**
 * About.jsx — About Page
 *
 * RESPONSIBILITY:
 *  Static informational page describing ShopNest Pro.
 *  No API calls, no state — pure presentational component.
 */

import styles from './About.module.css';

export default function About() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
      <div className={styles.card}>
        <h2>🛍️ Who We Are</h2>
        <p>
          Welcome to <strong>ShopNest Pro</strong> — your one-stop destination for quality
          products, unbeatable prices, and seamless shopping experiences. At ShopNest Pro,
          we believe that shopping should be easy, affordable, and enjoyable.
        </p>
        <br />
        <p>
          🚀 <strong>Our Mission:</strong> To deliver top-quality products at affordable
          prices while ensuring an exceptional online shopping experience. We are committed
          to customer satisfaction and transparency in everything we do.
        </p>
        <br />
        <p>
          💡 <strong>What Makes Us Different?</strong> Wide selection, secure payments,
          fast shipping, and 24/7 customer support with easy return policies.
        </p>
        <br />
        <p>
          🌐 <strong>Trusted by Shoppers Across India</strong> — with thousands of happy
          customers and growing daily, we strive to create a shopping community that values
          trust, convenience, and quality.
        </p>
      </div>
    </div>
  );
}
