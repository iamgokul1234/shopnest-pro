/**
 * Home.jsx — Product Listing Page
 *
 * PHASE 8 UPDATE:
 *  - Product cards are now clickable
 *  - Clicking a card navigates to product detail page
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ProductCard from "../components/product/ProductCard";
import api, { dummyApi } from "../services/api";
import styles from "./Home.module.css";

export default function Home({
  search = "",
  cart = [],
  setCart = () => {},
  wishlist = [],
  setWishlist = () => {},
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ─── Fetch Products On Mount ─────────────────────────────────────
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await dummyApi.get("/products");
        setProducts(response.data.products);
      } catch (err) {
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ─── Add To Cart ─────────────────────────────────────────────────
  const handleAddToCart = async (item) => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login to add items to your cart.",
        confirmButtonColor: "#333",
      });
      return;
    }

    const alreadyInCart = cart.find((p) => p.productId === item.id);

    try {
      const response = await api.post("/cart", {
        productId: item.id,
        title: item.title,
        price: item.price,
        thumbnail: item.thumbnail,
      });

      setCart(response.data.items);

      if (alreadyInCart) {
        Swal.fire({
          icon: "info",
          title: "Quantity Updated",
          text: `"${item.title}" quantity increased.`,
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Added to Cart!",
          text: `"${item.title}" has been added.`,
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to add item",
        text: error.response?.data?.message || "Please try again.",
        confirmButtonColor: "#333",
      });
    }
  };

  // ─── Toggle Wishlist ──────────────────────────────────────────────
  const handleWishlist = async (item) => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login to add items to your wishlist.",
        confirmButtonColor: "#333",
      });
      return;
    }

    const isWishlisted = wishlist.find(
      (w) => w.productId === item.id.toString(),
    );

    try {
      if (isWishlisted) {
        const response = await api.delete(`/wishlist/${item.id}`);
        setWishlist(response.data.items);

        Swal.fire({
          icon: "info",
          title: "Removed from Wishlist",
          timer: 1200,
          showConfirmButton: false,
        });
      } else {
        const response = await api.post("/wishlist", {
          productId: item.id.toString(),
          title: item.title,
          price: item.price,
          thumbnail: item.thumbnail,
          rating: item.rating,
        });
        setWishlist(response.data.items);

        Swal.fire({
          icon: "success",
          title: "Added to Wishlist!",
          timer: 1200,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.response?.data?.message || "Please try again.",
        confirmButtonColor: "#333",
      });
    }
  };

  // ─── Filter Products By Search ───────────────────────────────────
  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()),
  );

  // ─── Render States ───────────────────────────────────────────────
  if (loading) {
    return (
      <div
        style={{ textAlign: "center", marginTop: "100px", fontSize: "20px" }}
      >
        Loading products...
      </div>
    );
  }

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
            onWishlist={() => handleWishlist(product)}
            isWishlisted={
              !!wishlist.find((w) => w.productId === product.id.toString())
            }
            onCardClick={() => navigate(`/products/${product.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
