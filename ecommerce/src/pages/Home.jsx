import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ProductCard from "../components/product/ProductCard";
import FilterSidebar from "../components/common/FilterSidebar";
import api, { dummyApi } from "../services/api";
import styles from "./Home.module.css";
import Spinner from "../components/common/Spinner";

// ─── Default Filter State ─────────────────────────────────────────
const DEFAULT_FILTERS = {
  category: "all",
  minPrice: 0,
  maxPrice: 10000,
  minRating: 0,
  sortBy: "default",
};

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
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  // ─── Fetch Products On Mount ─────────────────────────────────────
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await dummyApi.get("/products?limit=100");
        setProducts(response.data.products);
      } catch (err) {
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ─── Handle Filter Change ─────────────────────────────────────────
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // ─── Reset Filters ────────────────────────────────────────────────
  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
  };

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

  // ─── Apply All Filters And Sorting ───────────────────────────────
  const getFilteredProducts = () => {
    let filtered = [...products];

    // Search filter
    if (search) {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase() === filters.category.toLowerCase(),
      );
    }

    // Price range filter
    filtered = filtered.filter(
      (p) => p.price >= filters.minPrice && p.price <= filters.maxPrice,
    );

    // Rating filter
    if (filters.minRating > 0) {
      filtered = filtered.filter((p) => p.rating >= filters.minRating);
    }

    // Sort
    switch (filters.sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating-desc":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  // ─── Render States ───────────────────────────────────────────────
  if (loading) {
    return <Spinner message="Loading products..." />;
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

  // ─── Main Render ─────────────────────────────────────────────────
  return (
    <div className={styles.homePage}>
      {/* ── Page Header ──────────────────────────────────────── */}
      <div className={styles.pageHeader}>
        <h3 className={styles.pageTitle}>Products</h3>
        <div className={styles.headerRight}>
          <span className={styles.resultCount}>
            {filteredProducts.length} products found
          </span>
          {/* Toggle filters on mobile */}
          <button
            className={styles.filterToggleBtn}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>
      </div>

      {/* ── Main Layout ──────────────────────────────────────── */}
      <div className={styles.mainLayout}>
        {/* Filter Sidebar */}
        <div
          className={`${styles.sidebarWrapper} ${showFilters ? styles.showSidebar : ""}`}
        >
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
          />
        </div>

        {/* Products Grid */}
        <div className={styles.productsSection}>
          {filteredProducts.length === 0 ? (
            <div className={styles.noResults}>
              <p>No products found matching your filters.</p>
              <button className={styles.resetBtn} onClick={handleReset}>
                Reset Filters
              </button>
            </div>
          ) : (
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
                    !!wishlist.find(
                      (w) => w.productId === product.id.toString(),
                    )
                  }
                  onCardClick={() => navigate(`/products/${product.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
