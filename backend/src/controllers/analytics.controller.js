import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

// ─── @route   GET /api/analytics ─────────────────────────────────
// @desc    Get all analytics data for admin dashboard
// @access  Admin only
export const getAnalytics = async (req, res) => {
  // ─── Run all queries simultaneously for performance ────────────
  const [totalOrders, totalUsers, totalProducts, orders, recentUsers] =
    await Promise.all([
      Order.countDocuments(),
      User.countDocuments(),
      Product.countDocuments(),
      Order.find({}).sort({ createdAt: -1 }),
      User.find({}).sort({ createdAt: -1 }).limit(5).select("-password"),
    ]);

  // ─── Calculate Total Revenue ───────────────────────────────────
  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.totalPrice, 0);

  // ─── Orders By Status ──────────────────────────────────────────
  const ordersByStatus = [
    {
      name: "Pending",
      value: orders.filter((o) => o.status === "pending").length,
      color: "#ff9800",
    },
    {
      name: "Processing",
      value: orders.filter((o) => o.status === "processing").length,
      color: "#2196f3",
    },
    {
      name: "Shipped",
      value: orders.filter((o) => o.status === "shipped").length,
      color: "#9c27b0",
    },
    {
      name: "Delivered",
      value: orders.filter((o) => o.status === "delivered").length,
      color: "#4caf50",
    },
    {
      name: "Cancelled",
      value: orders.filter((o) => o.status === "cancelled").length,
      color: "#f44336",
    },
  ];

  // ─── Revenue By Month (Last 6 Months) ─────────────────────────
  const last6Months = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);

    const monthName = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    const month = date.getMonth();

    const monthRevenue = orders
      .filter((o) => {
        const orderDate = new Date(o.createdAt);
        return (
          orderDate.getMonth() === month &&
          orderDate.getFullYear() === year &&
          o.status !== "cancelled"
        );
      })
      .reduce((sum, o) => sum + o.totalPrice, 0);

    const monthOrders = orders.filter((o) => {
      const orderDate = new Date(o.createdAt);
      return orderDate.getMonth() === month && orderDate.getFullYear() === year;
    }).length;

    last6Months.push({
      month: `${monthName} ${year}`,
      revenue: Math.round(monthRevenue * 100) / 100,
      orders: monthOrders,
    });
  }

  // ─── Recent Orders ─────────────────────────────────────────────
  const recentOrders = await Order.find({})
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .limit(5);

  res.status(200).json({
    success: true,
    data: {
      summary: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders,
        totalUsers,
        totalProducts,
      },
      ordersByStatus,
      revenueByMonth: last6Months,
      recentOrders,
      recentUsers,
    },
  });
};
