// Spinner.jsx — Reusable loading spinner component

import styles from './Spinner.module.css';

export default function Spinner({ message = 'Loading...' }) {
  return (
    <div className={styles.spinnerContainer}>
      <div className={styles.spinner}></div>
      <p className={styles.message}>{message}</p>
    </div>
  );
}