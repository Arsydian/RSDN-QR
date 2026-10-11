/**
 * @file ErrorBoundary.tsx
 * @description Catches render errors so one failing component cannot blank the whole app.
 * Shows `fallback` (or a full-page reload prompt) and recovers when any `resetKeys` value changes.
 */

import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  /** Rendered in place of the children after an error. Defaults to a full-page reload prompt. */
  fallback?: React.ReactNode;
  /** When any of these values change, the boundary clears its error and re-renders the children. */
  resetKeys?: unknown[];
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    console.error('RSDN-QR render error:', error, info.componentStack);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const prev = prevProps.resetKeys ?? [];
    const next = this.props.resetKeys ?? [];
    if (
      this.state.hasError &&
      (prev.length !== next.length || next.some((key, i) => !Object.is(key, prev[i])))
    ) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback !== undefined) return this.props.fallback;

    return (
      <div className="min-h-screen bg-ars-paper flex items-center justify-center p-4">
        <div className="ars-card p-6 max-w-md w-full text-center space-y-3">
          <AlertTriangle className="w-8 h-8 text-ars-red mx-auto" aria-hidden="true" />
          <h1 className="font-display font-bold text-base text-ars-black">Something went wrong</h1>
          <p className="text-sm text-ars-grey-600">
            The page hit an unexpected error. Reloading will start a fresh session.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-ars-red hover:bg-ars-red-600 text-white text-xs font-display font-bold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            Reload
          </button>
        </div>
      </div>
    );
  }
}
