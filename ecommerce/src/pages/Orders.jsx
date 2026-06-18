import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingBag, FaChevronDown, FaChevronUp } from "react-icons/fa";
import Swal from "sweetalert2";
import api from "../services/api";
import { ROUTES } from "../constants/routes";
import styles from "./Orders.module.css";
import Spinner from "../components/common/Spinner";

// ─── Status Badge Colors ──────────────────────────────────────────
const STATUS_COLORS = {
  pending: { bg: "#fff3e0", color: "#e65100" },
  processing: { bg: "#e3f2fd", color: "#1565c0" },
  shipped: { bg: "#f3e5f5", color: "#6a1b9a" },
  delivered: { bg: "#e8f5e9", color: "#2e7d32" },
  cancelled: { bg: "#ffebee", color: "#c62828" },
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const navigate = useNavigate();

  // ─── Fetch Orders On Mount ────────────────────────────────────
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await api.get("/orders/my");
        setOrders(response.data.orders);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Failed to load orders",
          text: error.response?.data?.message || "Please try again.",
          confirmButtonColor: "#333",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // ─── Toggle Order Details ─────────────────────────────────────
  const toggleOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // ─── Loading State ────────────────────────────────────────────
  if (loading) {
    return <Spinner message="Loading orders..." />;
  }

  return (
    <div className={styles.ordersPage}>
      <h2 className={styles.heading}>
        <FaShoppingBag /> My Orders
      </h2>

      {/* ── Empty Orders State ────────────────────────────────── */}
      {orders.length === 0 ? (
        <div className={styles.emptyOrders}>
          <FaShoppingBag size={60} style={{ color: "#e0e0e0" }} />
          <p>You have not placed any orders yet.</p>
          <button
            className={styles.shopBtn}
            onClick={() => navigate(ROUTES.HOME)}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className={styles.ordersList}>
          {orders.map((order) => (
            <div key={order._id} className={styles.orderCard}>
              {/* ── Order Header ──────────────────────────────── */}
              <div
                className={styles.orderHeader}
                onClick={() => toggleOrder(order._id)}
              >
                <div className={styles.orderInfo}>
                  <span className={styles.orderId}>
                    Order #{order._id.slice(-6).toUpperCase()}
                  </span>
                  <span className={styles.orderDate}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className={styles.orderMeta}>
                  <span
                    className={styles.statusBadge}
                    style={{
                      background: STATUS_COLORS[order.status]?.bg,
                      color: STATUS_COLORS[order.status]?.color,
                    }}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                  <span className={styles.orderTotal}>
                    ${order.totalPrice.toFixed(2)}
                  </span>
                  {expandedOrder === order._id ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </div>
              </div>

              {/* ── Order Details (Expandable) ────────────────── */}
              {expandedOrder === order._id && (
                <div className={styles.orderDetails}>
                  {/* Order Items */}
                  <div className={styles.orderItems}>
                    {order.items.map((item) => (
                      <div key={item.productId} className={styles.orderItem}>
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className={styles.itemImage}
                        />
                        <div className={styles.itemInfo}>
                          <p className={styles.itemTitle}>{item.title}</p>
                          <p className={styles.itemPrice}>
                            ${item.price} × {item.quantity} = $
                            {(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address */}
                  <div className={styles.shippingInfo}>
                    <h4 className={styles.shippingTitle}>Shipping Address</h4>
                    <p>{order.shippingAddress.fullName}</p>
                    <p>{order.shippingAddress.phone}</p>
                    <p>{order.shippingAddress.address}</p>
                    <p>
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state} -{" "}
                      {order.shippingAddress.pincode}
                    </p>
                  </div>

                  {/* Payment Info */}
                  <div className={styles.paymentInfo}>
                    <p>
                      <strong>Payment:</strong>{" "}
                      {order.paymentMethod === "cod"
                        ? "Cash on Delivery"
                        : "Razorpay"}
                    </p>
                    <p>
                      <strong>Paid:</strong> {order.isPaid ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
