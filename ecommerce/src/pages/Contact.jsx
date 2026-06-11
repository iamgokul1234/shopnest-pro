/**
 * Contact.jsx — Contact Page
 *
 * RESPONSIBILITY:
 *  Displays contact info and a contact form that sends emails
 *  via the Web3Forms API.
 *
 * KEY IMPROVEMENT (Phase 1):
 *  - Web3Forms API key moved from hardcoded string → .env variable
 *  - Removed console.log (not for production code)
 *  - Uses import.meta.env.VITE_WEB3FORMS_KEY (Vite's way to read .env)
 */

import { AiOutlineSend } from 'react-icons/ai';
import { FaLinkedin, FaPhoneAlt } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import Swal from 'sweetalert2';
import styles from './Contact.module.css';

export default function Contact() {

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    // ✅ API key read from .env — never hardcoded in source code
    // import.meta.env is Vite's way to access environment variables
    // The variable must start with VITE_ to be accessible in the browser
    formData.append('access_key', import.meta.env.VITE_WEB3FORMS_KEY);

    const payload = JSON.stringify(Object.fromEntries(formData));

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: payload,
      });

      const result = await res.json();

      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'Message Sent!',
          text: 'We will get back to you soon.',
          confirmButtonColor: '#727fde',
        });
        event.target.reset(); // Clear the form fields
      } else {
        throw new Error('Submission failed');
      }
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Failed to Send',
        text: 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <section className={styles.contactSection}>
      <h1>Contact Us</h1>

      {/* ── Contact Info ──────────────────────────────────────── */}
      <div className={styles.socialBox}>
        <a href="tel:+919345789315">
          <FaPhoneAlt className={styles.icon} /> +91 93457 89315
        </a>
        <a href="mailto:gokulakrish9345@gmail.com">
          <MdEmail className={styles.icon} /> gokulakrish9345@gmail.com
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noreferrer">
          <FaLinkedin className={styles.icon} /> LinkedIn
        </a>
      </div>

      {/* ── Contact Form ──────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className={styles.contactBox}>
        <p>Full Name</p>
        <input type="text" name="name" placeholder="Your Full Name" required />

        <p>Email Address</p>
        <input type="email" name="email" placeholder="Enter your email" required />

        <p>Your Message</p>
        <textarea
          className={styles.mess}
          name="message"
          placeholder="Share your thoughts..."
          required
        />

        <button type="submit">
          <AiOutlineSend /> Send Message
        </button>
      </form>
    </section>
  );
}
