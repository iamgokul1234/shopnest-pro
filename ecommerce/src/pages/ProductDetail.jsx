/**
 * ProductDetail.jsx — Product Detail Page
 *
 * FEATURES:
 *  - Shows full product details
 *  - Displays all reviews with star ratings
 *  - Allows logged in users to add reviews
 *  - Allows users to delete their own reviews
 *  - Add to cart from detail page
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaRegStar, FaTrash, FaShoppingCart } from 'react-icons/fa';
import Swal from 'sweetalert2';
import api, { dummyApi } from '../services/api';
import { ROUTES } from '../constants/routes';
import styles from './ProductDetail.module.css';

export default function ProductDetail({ cart, setCart }) {
  const { id } = useParams();
  const navigate = useNavigate();

  // ─── Product State ────────────────────────────────────────────
  const [product, setProduct] = useState(null);
  const [productLoading, setProductLoading] = useState(true);

  // ─── Reviews State ────────────────────────────────────────────
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // ─── Review Form State ────────────────────────────────────────
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // ─── Auth State ───────────────────────────────────────────────
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const isLoggedIn = !!localStorage.getItem('token');

  // ─── Fetch Product ────────────────────────────────────────────
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setProductLoading(true);
        const response = await dummyApi.get(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Product Not Found',
          text: 'This product does not exist.',
          confirmButtonColor: '#333',
        }).then(() => navigate(ROUTES.HOME));
      } finally {
        setProductLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ─── Fetch Reviews ────────────────────────────────────────────
  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const response = await api.get(`/reviews/${id}`);
      setReviews(response.data.reviews);
      setAverageRating(response.data.averageRating);
    } catch (error) {
      console.error('Failed to load reviews:', error.message);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [id]);

  // ─── Add To Cart ──────────────────────────────────────────────
  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please login to add items to your cart.',
        confirmButtonColor: '#333',
      });
      return;
    }

    try {
      const response = await api.post('/cart', {
        productId: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
      });

      setCart(response.data.items);

      Swal.fire({
        icon: 'success',
        title: 'Added to Cart!',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to add item',
        confirmButtonColor: '#333',
      });
    }
  };

  // ─── Submit Review ────────────────────────────────────────────
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Rating Required',
        text: 'Please select a star rating.',
        confirmButtonColor: '#333',
      });
      return;
    }

    setSubmitting(true);

    try {
      await api.post(`/reviews/${id}`, {
        rating,
        comment,
        productTitle: product.title,
      });

      Swal.fire({
        icon: 'success',
        title: 'Review Added!',
        timer: 1500,
        showConfirmButton: false,
      });

      // Reset form
      setRating(0);
      setComment('');

      // Reload reviews
      fetchReviews();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to add review',
        text: error.response?.data?.message || 'Please try again.',
        confirmButtonColor: '#333',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Delete Review ────────────────────────────────────────────
  const handleDeleteReview = async (reviewId) => {
    Swal.fire({
      title: 'Delete Review?',
      text: 'This cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#333',
      confirmButtonText: 'Yes, delete',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/reviews/${reviewId}`);
          Swal.fire({
            icon: 'success',
            title: 'Review Deleted',
            timer: 1200,
            showConfirmButton: false,
          });
          fetchReviews();
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Failed to delete review',
            confirmButtonColor: '#333',
          });
        }
      }
    });
  };

  // ─── Render Stars ─────────────────────────────────────────────
  const renderStars = (value) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <span key={star}>
        {star <= value ? (
          <FaStar style={{ color: '#f5a623' }} />
        ) : (
          <FaRegStar style={{ color: '#f5a623' }} />
        )}
      </span>
    ));
  };

  // ─── Interactive Stars For Form ───────────────────────────────
  const renderInteractiveStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={styles.starBtn}
        onClick={() => setRating(star)}
        onMouseEnter={() => setHoverRating(star)}
        onMouseLeave={() => setHoverRating(0)}
      >
        {star <= (hoverRating || rating) ? (
          <FaStar style={{ color: '#f5a623', fontSize: '24px' }} />
        ) : (
          <FaRegStar style={{ color: '#f5a623', fontSize: '24px' }} />
        )}
      </span>
    ));
  };

  // ─── Loading State ────────────────────────────────────────────
  if (productLoading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '20px' }}>
        Loading product...
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className={styles.container}>

      {/* ── Product Details Section ───────────────────────── */}
      <div className={styles.productSection}>
        {/* Product Image */}
        <div className={styles.imageSection}>
          <img
            src={product.thumbnail}
            alt={product.title}
            className={styles.productImage}
          />
        </div>

        {/* Product Info */}
        <div className={styles.infoSection}>
          <h1 className={styles.title}>{product.title}</h1>
          <p className={styles.category}>{product.category}</p>

          {/* Rating */}
          <div className={styles.ratingRow}>
            {renderStars(Math.round(averageRating))}
            <span className={styles.ratingText}>
              {averageRating} ({reviews.length} reviews)
            </span>
          </div>

          <p className={styles.price}>${product.price}</p>
          <p className={styles.description}>{product.description}</p>
          <p className={styles.stock}>
            {product.stock > 0
              ? `${product.stock} in stock`
              : 'Out of stock'}
          </p>

          {/* Add To Cart Button */}
          <button
            className={styles.addToCartBtn}
            onClick={handleAddToCart}
          >
            <FaShoppingCart /> Add to Cart
          </button>
        </div>
      </div>

      {/* ── Reviews Section ───────────────────────────────── */}
      <div className={styles.reviewsSection}>
        <h2 className={styles.reviewsHeading}>
          Customer Reviews
          {reviews.length > 0 && (
            <span className={styles.reviewCount}>
              ({reviews.length})
            </span>
          )}
        </h2>

        {/* Add Review Form — only for logged in users */}
        {isLoggedIn ? (
          <form
            className={styles.reviewForm}
            onSubmit={handleSubmitReview}
          >
            <h3>Write a Review</h3>

            {/* Star Rating Input */}
            <div className={styles.starsInput}>
              {renderInteractiveStars()}
            </div>

            {/* Comment Input */}
            <textarea
              className={styles.commentInput}
              placeholder="Share your experience with this product... (minimum 10 characters)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              minLength={10}
              maxLength={500}
              rows={4}
            />

            <div className={styles.formFooter}>
              <span className={styles.charCount}>
                {comment.length}/500
              </span>
              <button
                type="submit"
                className={styles.submitReviewBtn}
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        ) : (
          <div className={styles.loginPrompt}>
            <p>
              Please{' '}
              <span
                className={styles.loginLink}
                onClick={() => navigate(ROUTES.LOGIN)}
              >
                login
              </span>{' '}
              to write a review.
            </p>
          </div>
        )}

        {/* Reviews List */}
        {reviewsLoading ? (
          <p>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className={styles.noReviews}>
            No reviews yet. Be the first to review this product!
          </p>
        ) : (
          <div className={styles.reviewsList}>
            {reviews.map((review) => (
              <div key={review._id} className={styles.reviewCard}>
                {/* Review Header */}
                <div className={styles.reviewHeader}>
                  <div>
                    <span className={styles.reviewerName}>
                      {review.userName}
                    </span>
                    <div className={styles.reviewStars}>
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <div className={styles.reviewMeta}>
                    <span className={styles.reviewDate}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                    {/* Delete button — only for review owner or admin */}
                    {currentUser &&
                      (currentUser.id === review.user ||
                        currentUser.role === 'admin') && (
                        <button
                          className={styles.deleteReviewBtn}
                          onClick={() => handleDeleteReview(review._id)}
                        >
                          <FaTrash />
                        </button>
                      )}
                  </div>
                </div>

                {/* Review Comment */}
                <p className={styles.reviewComment}>{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}