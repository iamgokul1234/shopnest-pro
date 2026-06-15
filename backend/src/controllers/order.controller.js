import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

// ─── @route   POST /api/orders ────────────────────────────────────
// @desc    Place a new order
// @access  Private
export const placeOrder = async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;

  // Validate required fields
  if (!shippingAddress || !paymentMethod) {
    res.status(400);
    throw new Error("Please provide shipping address and payment method");
  }

  // Get user's cart
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error("Your cart is empty");
  }

  // Calculate total price
  const totalPrice = cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  // Create order from cart items
  const order = await Order.create({
    user: req.user._id,
    items: cart.items,
    shippingAddress,
    paymentMethod,
    totalPrice: Math.round(totalPrice * 100) / 100,
    status: "pending",
  });

  // Clear cart after order is placed
  cart.items = [];
  await cart.save();

  res.status(201).json({
    success: true,
    message: "Order placed successfully",
    order,
  });
};

// ─── @route   GET /api/orders/my ─────────────────────────────────
// @desc    Get logged in user's orders
// @access  Private
export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    total: orders.length,
    orders,
  });
};

// ─── @route   GET /api/orders/:id ────────────────────────────────
// @desc    Get single order by ID
// @access  Private
export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email",
  );

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Only allow order owner or admin to view
  if (
    order.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized to view this order");
  }

  res.status(200).json({
    success: true,
    order,
  });
};

// ─── @route   GET /api/orders ─────────────────────────────────────
// @desc    Get all orders
// @access  Admin only
export const getAllOrders = async (req, res) => {
  const orders = await Order.find({})
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  // Calculate total revenue
  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.totalPrice, 0);

  res.status(200).json({
    success: true,
    total: orders.length,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    orders,
  });
};

// ─── @route   PUT /api/orders/:id/status ─────────────────────────
// @desc    Update order status
// @access  Admin only
export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  const validStatuses = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  if (!status || !validStatuses.includes(status)) {
    res.status(400);
    throw new Error(
      "Invalid status. Must be one of: pending, processing, shipped, delivered, cancelled",
    );
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.status = status;

  // If status is delivered mark as paid for COD
  if (status === "delivered" && order.paymentMethod === "cod") {
    order.isPaid = true;
    order.paidAt = new Date();
  }

  await order.save();

  res.status(200).json({
    success: true,
    message: `Order status updated to ${status}`,
    order,
  });
};
