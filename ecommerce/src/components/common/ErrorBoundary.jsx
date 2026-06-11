/**
 * ErrorBoundary.jsx — Global Error Catcher
 *
 * WHAT IS AN ERROR BOUNDARY?
 *  A class component that catches JavaScript errors anywhere in its
 *  child component tree, logs them, and renders a fallback UI instead
 *  of crashing the entire application.
 *
 * WHY A CLASS COMPONENT?
 *  React's error boundary feature requires two lifecycle methods:
 *   - getDerivedStateFromError()  → update state to show fallback UI
 *   - componentDidCatch()        → log the error details
 *  These lifecycle methods only exist on class components.
 *  There is NO functional component equivalent for error boundaries.
 *
 * HOW TO USE:
 *  Wrap any component tree you want to protect:
 *  <ErrorBoundary>
 *    <SomeComponent />
 *  </ErrorBoundary>
 *
 *  If SomeComponent throws an error, ErrorBoundary catches it and
 *  shows the fallback UI below instead of a blank screen.
 */

import { Component } from 'react';
import styles from './ErrorBoundary.module.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    // hasError tracks whether a child component has crashed
    this.state = { hasError: false };
  }

  // ─── Step 1: Update State When Error Is Caught ──────────────────
  // Called during render phase when a child throws
  // Returns the new state to display the fallback UI
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  // ─── Step 2: Log The Error Details ──────────────────────────────
  // Called after render — use this for error reporting services
  // (e.g., Sentry, LogRocket — tools companies use to track errors)
  componentDidCatch(error, info) {
    // In production, you'd send this to an error monitoring service
    // For now, we just log it to the console during development
    console.error('ErrorBoundary caught an error:', error, info);
  }

  // ─── Reset The Error State ───────────────────────────────────────
  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    // If a child has errored, show the fallback UI
    if (this.state.hasError) {
      return (
        <div className={styles.container}>
          <h2 className={styles.title}>Something went wrong</h2>
          <p className={styles.message}>
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <div className={styles.actions}>
            {/* Try to recover without a full page reload */}
            <button className={styles.button} onClick={this.handleReset}>
              Try Again
            </button>
            {/* Full page reload as a last resort */}
            <button className={styles.buttonSecondary} onClick={() => window.location.reload()}>
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    // If no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
