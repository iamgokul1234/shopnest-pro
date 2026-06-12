/**
 * Home.jsx — Product Listing Page
 *
 * RESPONSIBILITY:
 *  Fetches all products from the API and displays them in a grid.
 *  Handles search filtering, loading state, and add-to-cart logic.
 *
 * DATA FLOW:
 *  App.jsx (owns state)
 *    → passes search, cart, setCart as props
 *    → Home filters and displays products
 *    → HomeCard triggers setCart via onAction prop
 *
 * API:
 *  Phase 1: DummyJSON (external mock API)
 *  Phase 2: Our own Express backend
 */

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ProductCard from "../components/product/ProductCard";
import { dummyApi } from "../services/api";
import styles from "./Home.module.css";

export default function Home({ search = "", cart = [], setCart = () => {} }) {
  // Stores the full list of products fetched from the API
  const [products, setProducts] = useState([]);

  // Tracks loading state to show a spinner while fetching
  const [loading, setLoading] = useState(true);

  // Tracks any error that occurred during the API call
  const [error, setError] = useState(null);

  // ─── Fetch Products On Mount ─────────────────────────────────────
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // api.get() uses our Axios instance (baseURL + timeout already set)
        // This replaces the old: fetch('https://dummyjson.com/products')
        const response = await dummyApi.get("/products");
        setProducts(response.data.products);
      } catch (err) {
        // Axios throws for ALL non-2xx responses (unlike fetch which doesn't)
        setError("Failed to load products. Please try again.");
      } finally {
        // Always stop loading, whether success or error
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Empty array = run once when component mounts

  // ─── Add To Cart ─────────────────────────────────────────────────
  const handleAddToCart = (item) => {
    // Check if product is already in cart using .find()
    const alreadyInCart = cart.find((p) => p.id === item.id);

    if (alreadyInCart) {
      // Replace old browser alert() with professional SweetAlert2 popup
      Swal.fire({
        icon: "info",
        title: "Already in Cart",
        text: `"${item.title}" is already in your cart.`,
        confirmButtonColor: "#ffce12",
      });
      return;
    }

    // Add the full product object to the cart array
    setCart([...cart, item]);

    // Show success confirmation
    Swal.fire({
      icon: "success",
      title: "Added to Cart!",
      text: `"${item.title}" has been added.`,
      timer: 1500, // Auto-closes after 1.5 seconds
      showConfirmButton: false,
    });
  };

  // ─── Filter Products By Search Query ────────────────────────────
  // Runs every render — filters the fetched list without another API call
  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()),
  );

  // ─── Render States ───────────────────────────────────────────────

  // Show loading state while fetching
  if (loading) {
    return (
      <div
        style={{ textAlign: "center", marginTop: "100px", fontSize: "20px" }}
      >
        Loading products...
      </div>
    );
  }

  // Show error state if fetch failed
  if (error) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "100px",
          color: "red",
          fontSize: "20px",
        }}
      >
        {error}
      </div>
    );
  }

  // Show empty state if search returns no results
  if (filteredProducts.length === 0) {
    return (
      <div
        style={{ textAlign: "center", marginTop: "100px", fontSize: "20px" }}
      >
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
