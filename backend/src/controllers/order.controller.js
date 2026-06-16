import crypto from "crypto";
import Razorpay from "razorpay";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";
import {
  orderConfirmationEmail,
  orderStatusEmail,
} from "../utils/emailTemplates.js";

// ─── Initialize Razorpay ──────────────────────────────────────────
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ─── @route   POST /api/orders ────────────────────────────────────
// @desc    Place a new order (COD)
// @access  Private
export const placeOrder = async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;

  if (!shippingAddress || !paymentMethod) {
    res.status(400);
    throw new Error("Please provide shipping address and payment method");
  }

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error("Your cart is empty");
  }

  const totalPrice = cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const order = await Order.create({
    user: req.user._id,
    items: cart.items,
    shippingAddress,
    paymentMethod,
    totalPrice: Math.round(totalPrice * 100) / 100,
    status: "pending",
  });

  cart.items = [];
  await cart.save();

  // Send order confirmation email
  const user = await User.findById(req.user._id);
  if (user) {
    const { subject, html } = orderConfirmationEmail(user.name, order);
    sendEmail({ to: user.email, subject, html });
  }

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

  if (status === "delivered" && order.paymentMethod === "cod") {
    order.isPaid = true;
    order.paidAt = new Date();
  }

  await order.save();

  // Send order status update email
  const user = await User.findById(order.user);
  if (user) {
    const { subject, html } = orderStatusEmail(user.name, order);
    sendEmail({ to: user.email, subject, html });
  }

  res.status(200).json({
    success: true,
    message: `Order status updated to ${status}`,
    order,
  });
};

// ─── @route   POST /api/orders/create-payment ─────────────────────
// @desc    Create Razorpay order for payment
// @access  Private
export const createPayment = async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error("Invalid amount");
  }

  // Razorpay amount is in paise (1 INR = 100 paise)
  const options = {
    amount: Math.round(amount * 100),
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  const razorpayOrder = await razorpay.orders.create(options);

  res.status(200).json({
    success: true,
    orderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
  });
};

// ─── @route   POST /api/orders/verify-payment ─────────────────────
// @desc    Verify Razorpay payment signature and place order
// @access  Private
export const verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    shippingAddress,
  } = req.body;

  // Verify payment signature
  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    res.status(400);
    throw new Error("Payment verification failed. Invalid signature.");
  }

  // Payment verified — place the order
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error("Cart is empty");
  }

  const totalPrice = cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const order = await Order.create({
    user: req.user._id,
    items: cart.items,
    shippingAddress,
    paymentMethod: "razorpay",
    totalPrice: Math.round(totalPrice * 100) / 100,
    status: "processing",
    paymentId: razorpay_payment_id,
    isPaid: true,
    paidAt: new Date(),
  });

  cart.items = [];
  await cart.save();

  // Send order confirmation email for Razorpay orders
  const userDoc = await User.findById(req.user._id);
  if (userDoc) {
    const { subject, html } = orderConfirmationEmail(userDoc.name, order);
    sendEmail({ to: userDoc.email, subject, html });
  }

  res.status(201).json({
    success: true,
    message: "Payment verified and order placed successfully",
    order,
  });
};
