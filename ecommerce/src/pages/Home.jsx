/**
 * Home.jsx — Product Listing Page
 *
 * PHASE 4 UPDATE:
 *  - Add to cart now calls POST /api/cart
 *  - Cart state synced with MongoDB
 */

import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import ProductCard from '../components/product/ProductCard';
import api, { dummyApi } from '../services/api';
import styles from './Home.module.css';

export default function Home({ search = '', cart = [], setCart = () => {} }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ─── Fetch Products On Mount ─────────────────────────────────────
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await dummyApi.get('/products');
        setProducts(response.data.products);
      } catch (err) {
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ─── Add To Cart ─────────────────────────────────────────────────
  const handleAddToCart = async (item) => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please login to add items to your cart.',
        confirmButtonColor: '#333',
      });
      return;
    }

    // Check if product is already in cart
    const alreadyInCart = cart.find((p) => p.productId === item.id);

    try {
      // Call our backend API to add item
      const response = await api.post('/cart', {
        productId: item.id,
        title: item.title,
        price: item.price,
        thumbnail: item.thumbnail,
      });

      // Update cart state with response from API
      setCart(response.data.items);

      if (alreadyInCart) {
        Swal.fire({
          icon: 'info',
          title: 'Quantity Updated',
          text: `"${item.title}" quantity increased.`,
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Added to Cart!',
          text: `"${item.title}" has been added.`,
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to add item',
        text: error.response?.data?.message || 'Please try again.',
        confirmButtonColor: '#333',
      });
    }
  };

  // ─── Filter Products By Search ───────────────────────────────────
  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  // ─── Render States ───────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '20px' }}>
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', color: 'red', fontSize: '20px' }}>
        {error}
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '20px' }}>
        No products found for "{search}"
      </div>
    );
  }

  // ─── Main Render ─────────────────────────────────────────────────
  return (
    <div>
      <h3>Product List</h3>
      <div className={styles.cardContainer}>
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            title={product.title}
            description={`Price: $${product.price} | Rating: ${product.rating}`}
            image={product.thumbnail}
            onAction={() => handleAddToCart(product)}
            actionLabel="Add to Cart"
          />
        ))}
      </div>
    </div>
  );
}