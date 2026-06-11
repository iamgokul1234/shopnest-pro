/**
 * NotFound.jsx — 404 Page
 *
 * RESPONSIBILITY:
 *  Displayed when a user navigates to a URL that doesn't match
 *  any defined route (e.g., /xyz, /random-page).
 *
 * This is assigned to the "*" catch-all route in AppRoutes.jsx.
 */

import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import styles from './NotFound.module.css';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      {/* Large 404 display */}
      <h1 className={styles.code}>404</h1>

      <h2 className={styles.title}>Page Not Found</h2>

      <p className={styles.message}>
        The page you are looking for doesn't exist or has been moved.
      </p>

      {/* Takes user back to the home page */}
      <button
        className={styles.button}
        onClick={() => navigate(ROUTES.HOME)}
      >
        Go Back Home
      </button>
    </div>
  );
}
