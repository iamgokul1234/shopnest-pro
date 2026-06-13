/**
 * AdminDashboard.jsx — Admin Control Panel
 *
 * PHASE 6 UPDATE:
 *  - Added image upload to Cloudinary
 *  - Image preview before submitting
 *  - Upload progress indicator
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

  // ─── Load Data On Mount ───────────────────────────────────────
  useEffect(() => {
    fetchProducts();
    fetchUsers();
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

    // Validate file type
    if (!file.type.startsWith("image/")) {
      Swal.fire({
        icon: "error",
        title: "Invalid File",
        text: "Please select an image file.",
        confirmButtonColor: "#333",
      });
      return;
    }

    // Validate file size (5MB max)
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

    // Create local preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  // ─── Upload Image To Cloudinary ───────────────────────────────
  const uploadImage = async () => {
    if (!imageFile) return null;

    setUploading(true);

    try {
      // Create FormData — required for file uploads
      const formData = new FormData();
      formData.append("image", imageFile);

      // Use axios with multipart/form-data
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
    // Show existing image as preview
    setImagePreview(product.thumbnail);
    setImageFile(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ─── Handle Submit Product Form ───────────────────────────────
  const handleProductSubmit = async (e) => {
    e.preventDefault();

    let thumbnailUrl = productForm.thumbnail;

    // If a new image was selected, upload it first
    if (imageFile) {
      thumbnailUrl = await uploadImage();
      if (!thumbnailUrl) return; // Upload failed, stop here
    }

    // Make sure we have a thumbnail
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
      const productData = {
        ...productForm,
        thumbnail: thumbnailUrl,
      };

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
      </div>

      {/* ── Products Tab ─────────────────────────────────────── */}
      {activeTab === "products" && (
        <div className={styles.tabContent}>
          {/* Add Product Button */}
          <button
            className={styles.addBtn}
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
          >
            {showForm ? "Cancel" : "+ Add Product"}
          </button>

          {/* Product Form */}
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

              {/* ── Image Upload Section ────────────────────── */}
              <div className={styles.imageUploadSection}>
                <label className={styles.imageUploadLabel}>Product Image</label>

                {/* Image Preview */}
                {imagePreview && (
                  <div className={styles.imagePreviewContainer}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className={styles.imagePreview}
                    />
                  </div>
                )}

                {/* File Input */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={styles.fileInput}
                  id="product-image"
                />
                <label
                  htmlFor="product-image"
                  className={styles.fileInputLabel}
                >
                  {imageFile ? imageFile.name : "Choose Image"}
                </label>

                {/* Upload Status */}
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

          {/* Products Table */}
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
    </div>
  );
}
