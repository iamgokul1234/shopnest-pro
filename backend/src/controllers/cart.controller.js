
import Cart from "../models/Cart.js";

// ─── @route   GET /api/cart ───────────────────────────────────────
// @desc    Get current user's cart
// @access  Private
export const getCart = async (req, res) => {
  // req.user is set by the protect middleware
  let cart = await Cart.findOne({ user: req.user._id });

  // If no cart exists yet, return empty cart
  if (!cart) {
    return res.status(200).json({
      success: true,
      items: [],
    });
  }

  res.status(200).json({
    success: true,
    items: cart.items,
  });
};

// ─── @route   POST /api/cart ──────────────────────────────────────
// @desc    Add item to cart or increase quantity if already exists
// @access  Private
export const addToCart = async (req, res) => {
  const { productId, title, price, thumbnail } = req.body;

  // Validate required fields
  if (!productId || !title || !price || !thumbnail) {
    res.status(400);
    throw new Error("Please provide productId, title, price and thumbnail");
  }

  // Find existing cart or create a new one
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    // First time adding to cart — create new cart document
    cart = new Cart({
      user: req.user._id,
      items: [],
    });
  }

  // Check if product already exists in cart
  const existingItem = cart.items.find(
    (item) => item.productId === productId
  );

  if (existingItem) {
    // Product already in cart — increase quantity by 1
    existingItem.quantity += 1;
  } else {
    // New product — add to items array
    cart.items.push({
      productId,
      title,
      price,
      thumbnail,
      quantity: 1,
    });
  }

  // Save the updated cart
  await cart.save();

  res.status(200).json({
    success: true,
    message: "Item added to cart",
    items: cart.items,
  });
};

// ─── @route   PUT /api/cart/:productId ───────────────────────────
// @desc    Update quantity of a cart item
// @access  Private
export const updateCartItem = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  // Validate quantity
  if (!quantity || quantity < 1) {
    res.status(400);
    throw new Error("Quantity must be at least 1");
  }

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  // Find the item in the cart
  const item = cart.items.find(
    (item) => item.productId === parseInt(productId)
  );

  if (!item) {
    res.status(404);
    throw new Error("Item not found in cart");
  }

  // Update the quantity
  item.quantity = quantity;
  await cart.save();

  res.status(200).json({
    success: true,
    message: "Cart item updated",
    items: cart.items,
  });
};

// ─── @route   DELETE /api/cart/:productId ────────────────────────
// @desc    Remove a single item from cart
// @access  Private
export const removeFromCart = async (req, res) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  // Filter out the item to remove
  cart.items = cart.items.filter(
    (item) => item.productId !== parseInt(productId)
  );

  await cart.save();

  res.status(200).json({
    success: true,
    message: "Item removed from cart",
    items: cart.items,
  });
};

// ─── @route   DELETE /api/cart ────────────────────────────────────
// @desc    Clear entire cart
// @access  Private
export const clearCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(200).json({
      success: true,
      message: "Cart is already empty",
      items: [],
    });
  }

  // Empty the items array
  cart.items = [];
  await cart.save();

  res.status(200).json({
    success: true,
    message: "Cart cleared",
    items: [],
  });
};