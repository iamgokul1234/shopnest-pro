/**
 * Register.jsx — User Registration Page
 *
 * PHASE 3 UPDATE:
 *  - Calls onLogin prop after successful registration
 *  - User is automatically logged in after registering
 *  - No more localStorage plain text password storage
 */

import { useState } from 'react';
import { CiLock, CiMail, CiUser } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../services/api';
import { ROUTES } from '../constants/routes';
import styles from './Register.module.css';

export default function Register({ onLogin }) {
  const [form, setForm] = useState({
    name: '',
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
      const response = await api.post('/auth/register', form);
      const { token, user } = response.data;

      // Call App.jsx handler — updates Navbar immediately
      // User is automatically logged in after registering
      onLogin(token, user);

      Swal.fire({
        icon: 'success',
        title: 'Account Created!',
        text: `Welcome to ShopNest Pro, ${user.name}!`,
        timer: 1800,
        showConfirmButton: false,
      }).then(() => {
        navigate(ROUTES.HOME);
      });

    } catch (error) {
      const message =
        error.response?.data?.message || 'Registration failed. Try again.';

      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: message,
        confirmButtonColor: '#333',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Create Account</h2>

      <form onSubmit={handleSubmit}>
        {/* Name Input */}
        <div className={styles.inputBox}>
          <CiUser className={styles.icon} />
          <input
            className={styles.modernInput}
            type="text"
            name="name"
            id="register-name"
            value={form.name}
            onChange={handleChange}
            required
            minLength={2}
          />
          <label htmlFor="register-name">Username</label>
        </div>

        {/* Email Input */}
        <div className={styles.inputBox}>
          <CiMail className={styles.icon} />
          <input
            type="email"
            name="email"
            id="register-email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <label htmlFor="register-email">Email</label>
        </div>

        {/* Password Input */}
        <div className={styles.inputBox}>
          <CiLock className={styles.icon} />
          <input
            type="password"
            name="password"
            id="register-password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
          />
          <label htmlFor="register-password">Password</label>
        </div>

        {/* Submit Button */}
        <div className={styles.buttonContainer}>
          <button
            className={styles.inputButton}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </div>
      </form>

      <p>
        Already have an account?{' '}
        <span
          style={{ color: 'blue', cursor: 'pointer' }}
          onClick={() => navigate(ROUTES.LOGIN)}
        >
          Login
        </span>
      </p>
    </div>
  );
}