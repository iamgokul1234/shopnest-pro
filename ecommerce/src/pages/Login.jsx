/**
 * Login.jsx — User Login Page
 *
 * PHASE 3 UPDATE:
 *  - Calls onLogin prop after successful login
 *  - onLogin updates App.jsx auth state immediately
 *  - Navbar updates instantly without page refresh
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../services/api';
import { ROUTES } from '../constants/routes';
import styles from './Login.module.css';

export default function Login({ onLogin }) {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ─── Controlled Input Handler ──────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // ─── Form Submission ───────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/login', form);
      const { token, user } = response.data;

      // Call App.jsx handler — updates Navbar immediately
      onLogin(token, user);

      Swal.fire({
        icon: 'success',
        title: 'Welcome back!',
        text: `Logged in as ${user.name}`,
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        navigate(ROUTES.HOME);
      });

    } catch (error) {
      const message =
        error.response?.data?.message || 'Login failed. Try again.';

      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: message,
        confirmButtonColor: '#333',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 style={{ color: 'black' }}>Login</h2>

      <form onSubmit={handleSubmit}>
        {/* Email Input */}
        <div className={styles.inputBox}>
          <input
            type="email"
            name="email"
            id="login-email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <label htmlFor="login-email">Email</label>
        </div>

        <br />

        {/* Password Input */}
        <div className={styles.inputBox}>
          <input
            type="password"
            name="password"
            id="login-password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <label htmlFor="login-password">Password</label>
        </div>

        {/* Submit Button */}
        <div className={styles.buttonContainer}>
          <button
            className={styles.inputButton}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>

      <p>
        Don't have an account?{' '}
        <span
          style={{ color: 'blue', cursor: 'pointer' }}
          onClick={() => navigate(ROUTES.REGISTER)}
        >
          Register
        </span>
      </p>
    </div>
  );
}