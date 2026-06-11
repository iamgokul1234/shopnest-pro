/**
 * Register.jsx — User Registration Page
 *
 * RESPONSIBILITY:
 *  Collects name, email, and password from the user.
 *  Saves to localStorage and redirects to Login.
 *
 * PHASE 3 UPGRADE:
 *  Will call POST /api/auth/register on the Express backend.
 *  Password will be hashed with bcrypt before saving to MongoDB.
 *  The plain localStorage approach will be completely removed.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CiLock, CiMail, CiUser } from 'react-icons/ci';
import Swal from 'sweetalert2';
import { ROUTES } from '../constants/routes';
import styles from './Register.module.css';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  // ─── Controlled Input Handler ────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // ─── Form Submission ─────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();

    // Temporarily saving to localStorage (Phase 3 replaces this)
    // WARNING: Never store passwords in plain text in production
    localStorage.setItem('user', JSON.stringify(form));

    // Success notification using SweetAlert2
    Swal.fire({
      icon: 'success',
      title: 'Registered!',
      text: 'Your account has been created. Please log in.',
      timer: 1800,
      showConfirmButton: false,
    }).then(() => {
      navigate(ROUTES.LOGIN);
    });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Register Form</h2>

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
          />
          <label htmlFor="register-password">Password</label>
        </div>

        {/* Submit Button */}
        <div className={styles.buttonContainer}>
          <button className={styles.inputButton} type="submit">
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
