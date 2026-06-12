/**
 * AdminDashboard.jsx — Admin Control Panel
 *
 * FEATURES:
 *  - View all products from our own database
 *  - Add new products
 *  - Edit existing products
 *  - Delete products
 *  - View all registered users
 *  - Delete users
 *  - Update user roles
 */

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from '../services/api';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  // ─── Tab State ────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('products');

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
    title: '',
    description: '',
    price: '',
    thumbnail: '',
    category: '',
    stock: '',
    rating: '',
  });

  // ─── Fetch Products ───────────────────────────────────────────
  const fetchProducts = async () => {
    try {
      setProductLoading(true);
      const response = await api.get('/products');
      setProducts(response.data.products);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to load products',
        text: error.response?.data?.message || 'Please try again.',
        confirmButtonColor: '#333',
      });
    } finally {
      setProductLoading(false);
    }
  };

  // ─── Fetch Users ──────────────────────────────────────────────
  const fetchUsers = async () => {
    try {
      setUserLoading(true);
      const response = await api.get('/users');
      setUsers(response.data.users);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to load users',
        text: error.response?.data?.message || 'Please try again.',
        confirmButtonColor: '#333',
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

  // ─── Reset Product Form ───────────────────────────────────────
  const resetForm = () => {
    setProductForm({
      title: '',
      description: '',
      price: '',
      thumbnail: '',
      category: '',
      stock: '',
      rating: '',
    });
    setEditingProduct(null);
    setShowForm(false);
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
    setShowForm(true);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ─── Handle Submit Product Form ───────────────────────────────
  const handleProductSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingProduct) {
        // Update existing product
        await api.put(`/products/${editingProduct._id}`, productForm);
        Swal.fire({
          icon: 'success',
          title: 'Product Updated',
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        // Create new product
        await api.post('/products', productForm);
        Swal.fire({
          icon: 'success',
          title: 'Product Created',
          timer: 1500,
          showConfirmButton: false,
        });
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to save product',
        text: error.response?.data?.message || 'Please try again.',
        confirmButtonColor: '#333',
      });
    }
  };

  // ─── Handle Delete Product ────────────────────────────────────
  const handleDeleteProduct = async (id, title) => {
    Swal.fire({
      title: `Delete "${title}"?`,
      text: 'This cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#333',
      confirmButtonText: 'Yes, delete',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/products/${id}`);
          Swal.fire({
            icon: 'success',
            title: 'Product Deleted',
            timer: 1200,
            showConfirmButton: false,
          });
          fetchProducts();
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Failed to delete product',
            confirmButtonColor: '#333',
          });
        }
      }
    });
  };

  // ─── Handle Delete User ───────────────────────────────────────
  const handleDeleteUser = async (id, name) => {
    Swal.fire({
      title: `Delete user "${name}"?`,
      text: 'This cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#333',
      confirmButtonText: 'Yes, delete',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/users/${id}`);
          Swal.fire({
            icon: 'success',
            title: 'User Deleted',
            timer: 1200,
            showConfirmButton: false,
          });
          fetchUsers();
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Failed to delete user',
            text: error.response?.data?.message || 'Please try again.',
            confirmButtonColor: '#333',
          });
        }
      }
    });
  };

  // ─── Handle Update User Role ──────────────────────────────────
  const handleRoleChange = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';

    Swal.fire({
      title: `Change role to "${newRole}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#333',
      confirmButtonText: 'Yes, change',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.put(`/users/${id}`, { role: newRole });
          Swal.fire({
            icon: 'success',
            title: 'Role Updated',
            timer: 1200,
            showConfirmButton: false,
          });
          fetchUsers();
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Failed to update role',
            text: error.response?.data?.message || 'Please try again.',
            confirmButtonColor: '#333',
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
          className={`${styles.tab} ${activeTab === 'products' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Products ({products.length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'users' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users ({users.length})
        </button>
      </div>

      {/* ── Products Tab ─────────────────────────────────────── */}
      {activeTab === 'products' && (
        <div className={styles.tabContent}>

          {/* Add Product Button */}
          <button
            className={styles.addBtn}
            onClick={() => { resetForm(); setShowForm(!showForm); }}
          >
            {showForm ? 'Cancel' : '+ Add Product'}
          </button>

          {/* Product Form */}
          {showForm && (
            <form
              className={styles.productForm}
              onSubmit={handleProductSubmit}
            >
              <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>

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
                <input
                  type="text"
                  name="thumbnail"
                  placeholder="Thumbnail URL"
                  value={productForm.thumbnail}
                  onChange={handleFormChange}
                  required
                  className={styles.input}
                />
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
                <button type="submit" className={styles.submitBtn}>
                  {editingProduct ? 'Update Product' : 'Create Product'}
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
      {activeTab === 'users' && (
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
                            user.role === 'admin'
                              ? styles.adminBadge
                              : styles.userBadge
                          }
                        >
                          {user.role}
                        </span>
                      </td>
                      <td>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <button
                          className={styles.editBtn}
                          onClick={() =>
                            handleRoleChange(user._id, user.role)
                          }
                        >
                          Toggle Role
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() =>
                            handleDeleteUser(user._id, user.name)
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
    </div>
  );
}