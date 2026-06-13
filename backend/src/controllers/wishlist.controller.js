import Wishlist from "../models/Wishlist.js";

// ─── @route   GET /api/wishlist ───────────────────────────────────
// @desc    Get current user's wishlist
// @access  Private
export const getWishlist = async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    return res.status(200).json({
      success: true,
      items: [],
    });
  }

  res.status(200).json({
    success: true,
    items: wishlist.items,
  });
};

// ─── @route   POST /api/wishlist ──────────────────────────────────
// @desc    Add item to wishlist
// @access  Private
export const addToWishlist = async (req, res) => {
  const { productId, title, price, thumbnail, rating } = req.body;

  if (!productId || !title || !price || !thumbnail) {
    res.status(400);
    throw new Error("Please provide productId, title, price and thumbnail");
  }

  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    wishlist = new Wishlist({
      user: req.user._id,
      items: [],
    });
  }

  // Check if product already exists in wishlist
  const existingItem = wishlist.items.find(
    (item) => item.productId === productId.toString(),
  );

  if (existingItem) {
    return res.status(400).json({
      success: false,
      message: "Product already in wishlist",
    });
  }

  // Add new item to wishlist
  wishlist.items.push({
    productId: productId.toString(),
    title,
    price,
    thumbnail,
    rating: rating || 0,
  });

  await wishlist.save();

  res.status(200).json({
    success: true,
    message: "Item added to wishlist",
    items: wishlist.items,
  });
};

// ─── @route   DELETE /api/wishlist/:productId ─────────────────────
// @desc    Remove single item from wishlist
// @access  Private
export const removeFromWishlist = async (req, res) => {
  const { productId } = req.params;

  const wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    res.status(404);
    throw new Error("Wishlist not found");
  }

  // Filter out the item to remove
  wishlist.items = wishlist.items.filter(
    (item) => item.productId !== productId.toString(),
  );

  await wishlist.save();

  res.status(200).json({
    success: true,
    message: "Item removed from wishlist",
    items: wishlist.items,
  });
};

// ─── @route   DELETE /api/wishlist ───────────────────────────────
// @desc    Clear entire wishlist
// @access  Private
export const clearWishlist = async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    return res.status(200).json({
      success: true,
      message: "Wishlist is already empty",
      items: [],
    });
  }

  wishlist.items = [];
  await wishlist.save();

  res.status(200).json({
    success: true,
    message: "Wishlist cleared",
    items: [],
  });
};
