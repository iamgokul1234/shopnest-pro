/**
 * FilterSidebar.jsx — Product Filter Component
 *
 * FEATURES:
 *  - Category filter
 *  - Price range filter
 *  - Rating filter
 *  - Sort options
 *  - Reset all filters
 */

import styles from './FilterSidebar.module.css';

const CATEGORIES = [
  'all',
  'smartphones',
  'laptops',
  'fragrances',
  'skincare',
  'groceries',
  'home-decoration',
  'furniture',
  'tops',
  'womens-dresses',
  'womens-shoes',
  'mens-shirts',
  'mens-shoes',
  'mens-watches',
  'womens-watches',
  'womens-bags',
  'womens-jewellery',
  'sunglasses',
  'automotive',
  'motorcycle',
  'lighting',
];

const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Highest Rated' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
];

export default function FilterSidebar({ filters, onFilterChange, onReset }) {
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h3 className={styles.sidebarTitle}>Filters</h3>
        <button className={styles.resetBtn} onClick={onReset}>
          Reset All
        </button>
      </div>

      {/* ── Sort By ────────────────────────────────────────── */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Sort By</label>
        <select
          className={styles.select}
          value={filters.sortBy}
          onChange={(e) => onFilterChange('sortBy', e.target.value)}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* ── Category ───────────────────────────────────────── */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Category</label>
        <select
          className={styles.select}
          value={filters.category}
          onChange={(e) => onFilterChange('category', e.target.value)}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'all'
                ? 'All Categories'
                : cat.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
            </option>
          ))}
        </select>
      </div>

      {/* ── Price Range ─────────────────────────────────────── */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>
          Price Range: ${filters.minPrice} — ${filters.maxPrice}
        </label>
        <div className={styles.priceInputs}>
          <input
            type="number"
            className={styles.priceInput}
            placeholder="Min"
            value={filters.minPrice}
            min="0"
            onChange={(e) =>
              onFilterChange('minPrice', Number(e.target.value))
            }
          />
          <span className={styles.priceSeparator}>to</span>
          <input
            type="number"
            className={styles.priceInput}
            placeholder="Max"
            value={filters.maxPrice}
            min="0"
            onChange={(e) =>
              onFilterChange('maxPrice', Number(e.target.value))
            }
          />
        </div>
      </div>

      {/* ── Minimum Rating ──────────────────────────────────── */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Minimum Rating</label>
        <div className={styles.ratingOptions}>
          {[0, 1, 2, 3, 4].map((rating) => (
            <button
              key={rating}
              className={`${styles.ratingBtn} ${
                filters.minRating === rating ? styles.activeRating : ''
              }`}
              onClick={() => onFilterChange('minRating', rating)}
            >
              {rating === 0 ? 'All' : `${rating}★ & up`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}