/**
 * Login.jsx — User Login Page
 *
 * RESPONSIBILITY:
 *  Handles user login using credentials stored in localStorage.
 *
 * CURRENT IMPLEMENTATION (Phase 1):
 *  - Reads user from localStorage (set during Register)
 *  - Compares email + password directly
 *  - Redirects to home on success
 *
 * PHASE 3 UPGRADE:
 *  - Will call POST /api/auth/login on our Express backend
 *  - Backend will validate credentials against MongoDB
 *  - Backend will return a JWT token
 *  - Token stored in localStorage, used in Axios interceptor
 *
 * SECURITY NOTE:
 *  The current localStorage approach stores plain text passwords.
 *  This is a TEMPORARY pattern for development only.
 *  Phase 3 will replace this entirely with JWT + bcrypt.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ROUTES } from '../constants/routes';
import styles from './Login.module.css';

export default function Login() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  // ─── Controlled Input Handler ────────────────────────────────────
  // Single handler for all inputs using [name] dynamic key
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // ─── Form Submission ─────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default HTML form page refresh

    // Read the user object saved during registration
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.email === form.email && user.password === form.password) {
      // Login success — will be replaced with JWT in Phase 3
      Swal.fire({
        icon: 'success',
        title: 'Welcome back!',
        text: `Logged in as ${user.name}`,
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        navigate(ROUTES.HOME);
      });
    } else {
      // Login failure — replaced browser alert() with SweetAlert2
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Invalid email or password. Please try again.',
        confirmButtonColor: '#333',
      });
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
          <button className={styles.inputButton} type="submit">
            Login
          </button>
        </div>
      </form>

      {/* Link to Register */}
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
