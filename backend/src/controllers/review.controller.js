import Review from "../models/Review.js";

// ─── @route   GET /api/reviews/:productId ────────────────────────
// @desc    Get all reviews for a product
// @access  Public
export const getProductReviews = async (req, res) => {
  const { productId } = req.params;

  const reviews = await Review.find({ productId }).sort({ createdAt: -1 }); // newest first

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  res.status(200).json({
    success: true,
    total: reviews.length,
    averageRating: Math.round(averageRating * 10) / 10,
    reviews,
  });
};

// ─── @route   POST /api/reviews/:productId ────────────────────────
// @desc    Add a review for a product
// @access  Private
export const addReview = async (req, res) => {
  const { productId } = req.params;
  const { rating, comment, productTitle } = req.body;

  // Validate required fields
  if (!rating || !comment || !productTitle) {
    res.status(400);
    throw new Error("Please provide rating, comment and productTitle");
  }

  // Check if user already reviewed this product
  const existingReview = await Review.findOne({
    user: req.user._id,
    productId,
  });

  if (existingReview) {
    res.status(400);
    throw new Error("You have already reviewed this product");
  }

  // Create new review
  const review = await Review.create({
    user: req.user._id,
    userName: req.user.name,
    productId,
    productTitle,
    rating: Number(rating),
    comment,
  });

  res.status(201).json({
    success: true,
    message: "Review added successfully",
    review,
  });
};

// ─── @route   DELETE /api/reviews/:id ────────────────────────────
// @desc    Delete own review
// @access  Private
export const deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  // Only the review author or admin can delete
  if (
    review.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized to delete this review");
  }

  await review.deleteOne();

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
};
