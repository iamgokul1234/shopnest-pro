/**
 * AdminDashboard.jsx — Admin Control Panel
 *
 * PHASE 10 UPDATE:
 *  - Added Orders tab
 *  - Admin can view all orders
 *  - Admin can update order status
 */

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import api from "../services/api";
import styles from "./AdminDashboard.module.css";

export default function AdminDashboard() {
  // ─── Tab State ────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("products");

  // ─── Products State ───────────────────────────────────────────
  const [products, setProducts] = useState([]);
  const [productLoading, setProductLoading] = useState(true);

  // ─── Users State ──────────────────────────────────────────────
  const [users, setUsers] = useState([]);
  const [userLoading, setUserLoading] = useState(true);

  // ─── Orders State ─────────────────────────────────────────────
  const [orders, setOrders] = useState([]);
  const [orderLoading, setOrderLoading] = useState(true);

  // ─── Product Form State ───────────────────────────────────────
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    title: "",
    description: "",
    price: "",
    thumbnail: "",
    category: "",
    stock: "",
    rating: "",
  });

  // ─── Image Upload State ───────────────────────────────────────
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  // ─── Fetch Products ───────────────────────────────────────────
  const fetchProducts = async () => {
    try {
      setProductLoading(true);
      const response = await api.get("/products");
      setProducts(response.data.products);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to load products",
        text: error.response?.data?.message || "Please try again.",
        confirmButtonColor: "#333",
      });
    } finally {
      setProductLoading(false);
    }
  };

  // ─── Fetch Users ──────────────────────────────────────────────
  const fetchUsers = async () => {
    try {
      setUserLoading(true);
      const response = await api.get("/users");
      setUsers(response.data.users);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to load users",
        text: error.response?.data?.message || "Please try again.",
        confirmButtonColor: "#333",
      });
    } finally {
      setUserLoading(false);
    }
  };

  // ─── Fetch Orders ─────────────────────────────────────────────
  const fetchOrders = async () => {
    try {
      setOrderLoading(true);
      const response = await api.get("/orders");
      setOrders(response.data.orders);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to load orders",
        text: error.response?.data?.message || "Please try again.",
        confirmButtonColor: "#333",
      });
    } finally {
      setOrderLoading(false);
    }
  };

  // ─── Load Data On Mount ───────────────────────────────────────
  useEffect(() => {
    fetchProducts();
    fetchUsers();
    fetchOrders();
  }, []);

  // ─── Handle Product Form Change ───────────────────────────────
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setProductForm({ ...productForm, [name]: value });
  };

  // ─── Handle Image File Selection ──────────────────────────────
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      Swal.fire({
        icon: "error",
        title: "Invalid File",
        text: "Please select an image file.",
        confirmButtonColor: "#333",
      });
      return;
    }

    if (file.size > 1024 * 1024 * 5) {
      Swal.fire({
        icon: "error",
        title: "File Too Large",
        text: "Image must be less than 5MB.",
        confirmButtonColor: "#333",
      });
      return;
    }

    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  // ─── Upload Image To Cloudinary ───────────────────────────────
  const uploadImage = async () => {
    if (!imageFile) return null;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.imageUrl;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Image Upload Failed",
        text: error.response?.data?.message || "Please try again.",
        confirmButtonColor: "#333",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  // ─── Reset Product Form ───────────────────────────────────────
  const resetForm = () => {
    setProductForm({
      title: "",
      description: "",
      price: "",
      thumbnail: "",
      category: "",
      stock: "",
      rating: "",
    });
    setEditingProduct(null);
    setShowForm(false);
    setImageFile(null);
    setImagePreview(null);
  };

  // ─── Handle Edit Product ──────────────────────────────────────
  const handleEdit = (product) => {
    setEditingProduct(product);
    setProductForm({
      title: product.title,
      description: product.description,
      price: product.price,
      thumbnail: product.thumbnail,
      category: product.category,
      stock: product.stock,
      rating: product.rating,
    });
    setImagePreview(product.thumbnail);
    setImageFile(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ─── Handle Submit Product Form ───────────────────────────────
  const handleProductSubmit = async (e) => {
    e.preventDefault();

    let thumbnailUrl = productForm.thumbnail;

    if (imageFile) {
      thumbnailUrl = await uploadImage();
      if (!thumbnailUrl) return;
    }

    if (!thumbnailUrl) {
      Swal.fire({
        icon: "error",
        title: "Image Required",
        text: "Please upload a product image.",
        confirmButtonColor: "#333",
      });
      return;
    }

    try {
      const productData = { ...productForm, thumbnail: thumbnailUrl };

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, productData);
        Swal.fire({
          icon: "success",
          title: "Product Updated",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await api.post("/products", productData);
        Swal.fire({
          icon: "success",
          title: "Product Created",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to save product",
        text: error.response?.data?.message || "Please try again.",
        confirmButtonColor: "#333",
      });
    }
  };

  // ─── Handle Delete Product ────────────────────────────────────
  const handleDeleteProduct = async (id, title) => {
    Swal.fire({
      title: `Delete "${title}"?`,
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#333",
      confirmButtonText: "Yes, delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/products/${id}`);
          Swal.fire({
            icon: "success",
            title: "Product Deleted",
            timer: 1200,
            showConfirmButton: false,
          });
          fetchProducts();
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Failed to delete product",
            confirmButtonColor: "#333",
          });
        }
      }
    });
  };

  // ─── Handle Delete User ───────────────────────────────────────
  const handleDeleteUser = async (id, name) => {
    Swal.fire({
      title: `Delete user "${name}"?`,
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#333",
      confirmButtonText: "Yes, delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/users/${id}`);
          Swal.fire({
            icon: "success",
            title: "User Deleted",
            timer: 1200,
            showConfirmButton: false,
          });
          fetchUsers();
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Failed to delete user",
            text: error.response?.data?.message || "Please try again.",
            confirmButtonColor: "#333",
          });
        }
      }
    });
  };

  // ─── Handle Update User Role ──────────────────────────────────
  const handleRoleChange = async (id, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";

    Swal.fire({
      title: `Change role to "${newRole}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#333",
      confirmButtonText: "Yes, change",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.put(`/users/${id}`, { role: newRole });
          Swal.fire({
            icon: "success",
            title: "Role Updated",
            timer: 1200,
            showConfirmButton: false,
          });
          fetchUsers();
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Failed to update role",
            text: error.response?.data?.message || "Please try again.",
            confirmButtonColor: "#333",
          });
        }
      }
    });
  };

  // ─── Handle Update Order Status ───────────────────────────────
  const handleUpdateOrderStatus = async (id, currentStatus) => {
    const { value: selectedStatus } = await Swal.fire({
      title: "Update Order Status",
      input: "select",
      inputOptions: {
        pending: "Pending",
        processing: "Processing",
        shipped: "Shipped",
        delivered: "Delivered",
        cancelled: "Cancelled",
      },
      inputValue: currentStatus,
      showCancelButton: true,
      confirmButtonColor: "#333",
      confirmButtonText: "Update",
    });

    if (selectedStatus) {
      try {
        await api.put(`/orders/${id}/status`, { status: selectedStatus });
        Swal.fire({
          icon: "success",
          title: "Status Updated",
          timer: 1200,
          showConfirmButton: false,
        });
        fetchOrders();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Failed to update status",
          text: error.response?.data?.message || "Please try again.",
          confirmButtonColor: "#333",
        });
      }
    }
  };

  // ─── Status Badge Style ───────────────────────────────────────
  const getStatusStyle = (status) => {
    const styles = {
      pending: { background: "#fff3e0", color: "#e65100" },
      processing: { background: "#e3f2fd", color: "#1565c0" },
      shipped: { background: "#f3e5f5", color: "#6a1b9a" },
      delivered: { background: "#e8f5e9", color: "#2e7d32" },
      cancelled: { background: "#ffebee", color: "#c62828" },
    };
    return styles[status] || {};
  };

  return (
    <div className={styles.dashboard}>
      <h2 className={styles.heading}>Admin Dashboard</h2>

      {/* ── Tabs ─────────────────────────────────────────────── */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "products" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("products")}
        >
          Products ({products.length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === "users" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("users")}
        >
          Users ({users.length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === "orders" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          Orders ({orders.length})
        </button>
      </div>

      {/* ── Products Tab ─────────────────────────────────────── */}
      {activeTab === "products" && (
        <div className={styles.tabContent}>
          <button
            className={styles.addBtn}
            onClick={() => { resetForm(); setShowForm(!showForm); }}
          >
            {showForm ? "Cancel" : "+ Add Product"}
          </button>

          {showForm && (
            <form className={styles.productForm} onSubmit={handleProductSubmit}>
              <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>

              <div className={styles.formGrid}>
                <input
                  type="text"
                  name="title"
                  placeholder="Product Title"
                  value={productForm.title}
                  onChange={handleFormChange}
                  required
                  className={styles.input}
                />
                <input
                  type="text"
                  name="category"
                  placeholder="Category"
                  value={productForm.category}
                  onChange={handleFormChange}
                  required
                  className={styles.input}
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={productForm.price}
                  onChange={handleFormChange}
                  required
                  min="0"
                  step="0.01"
                  className={styles.input}
                />
                <input
                  type="number"
                  name="stock"
                  placeholder="Stock"
                  value={productForm.stock}
                  onChange={handleFormChange}
                  min="0"
                  className={styles.input}
                />
                <input
                  type="number"
                  name="rating"
                  placeholder="Rating (0-5)"
                  value={productForm.rating}
                  onChange={handleFormChange}
                  min="0"
                  max="5"
                  step="0.1"
                  className={styles.input}
                />
              </div>

              <div className={styles.imageUploadSection}>
                <label className={styles.imageUploadLabel}>Product Image</label>
                {imagePreview && (
                  <div className={styles.imagePreviewContainer}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className={styles.imagePreview}
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={styles.fileInput}
                  id="product-image"
                />
                <label htmlFor="product-image" className={styles.fileInputLabel}>
                  {imageFile ? imageFile.name : "Choose Image"}
                </label>
                {uploading && (
                  <p className={styles.uploadingText}>
                    Uploading to Cloudinary...
                  </p>
                )}
              </div>

              <textarea
                name="description"
                placeholder="Product Description"
                value={productForm.description}
                onChange={handleFormChange}
                required
                className={styles.textarea}
                rows={3}
              />

              <div className={styles.formActions}>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={uploading}
                >
                  {uploading
                    ? "Uploading..."
                    : editingProduct
                    ? "Update Product"
                    : "Create Product"}
                </button>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={resetForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {productLoading ? (
            <p>Loading products...</p>
          ) : products.length === 0 ? (
            <p>No products found. Add your first product.</p>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className={styles.productThumb}
                        />
                      </td>
                      <td>{product.title}</td>
                      <td>{product.category}</td>
                      <td>${product.price}</td>
                      <td>{product.stock}</td>
                      <td>{product.rating}</td>
                      <td>
                        <button
                          className={styles.editBtn}
                          onClick={() => handleEdit(product)}
                        >
                          Edit
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() =>
                            handleDeleteProduct(product._id, product.title)
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Users Tab ────────────────────────────────────────── */}
      {activeTab === "users" && (
        <div className={styles.tabContent}>
          {userLoading ? (
            <p>Loading users...</p>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span
                          className={
                            user.role === "admin"
                              ? styles.adminBadge
                              : styles.userBadge
                          }
                        >
                          {user.role}
                        </span>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          className={styles.editBtn}
                          onClick={() => handleRoleChange(user._id, user.role)}
                        >
                          Toggle Role
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDeleteUser(user._id, user.name)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Orders Tab ───────────────────────────────────────── */}
      {activeTab === "orders" && (
        <div className={styles.tabContent}>
          {orderLoading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>#{order._id.slice(-6).toUpperCase()}</td>
                      <td>
                        <div>{order.user?.name}</div>
                        <div style={{ fontSize: "12px", color: "#888" }}>
                          {order.user?.email}
                        </div>
                      </td>
                      <td>{order.items.length} item(s)</td>
                      <td>${order.totalPrice.toFixed(2)}</td>
                      <td>
                        {order.paymentMethod === "cod"
                          ? "Cash on Delivery"
                          : "Razorpay"}
                      </td>
                      <td>
                        <span
                          className={styles.statusBadge}
                          style={getStatusStyle(order.status)}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <button
                          className={styles.editBtn}
                          onClick={() =>
                            handleUpdateOrderStatus(order._id, order.status)
                          }
                        >
                          Update Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}