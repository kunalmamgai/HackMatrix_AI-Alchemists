import { Component } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * React error boundary — catches render errors and shows a fallback UI
 * instead of crashing the entire app.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      const isDev = import.meta.env.DEV;

      return (
        <div className="min-h-[40vh] flex items-center justify-center p-8">
          <div className="text-center max-w-lg">
            <div className="w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-danger-500" />
            </div>

            <h2 className="text-2xl font-bold text-ink-900 mb-2">
              Something went wrong
            </h2>
            <p className="text-ink-500 mb-6">
              {this.props.fallbackMessage ||
                'An unexpected error occurred. Please try again or go back to the home page.'}
            </p>

            {/* Show error details in development */}
            {isDev && this.state.error && (
              <div className="mb-6 p-4 rounded-xl bg-danger-50 border border-danger-200 text-left">
                <p className="text-sm font-mono text-danger-700 break-all">
                  {this.state.error.message}
                </p>
                {this.state.errorInfo && (
                  <pre className="mt-2 text-xs text-danger-600 overflow-auto max-h-40">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={this.handleRetry}
                className="btn-primary inline-flex items-center gap-2"
              >
                <RefreshCcw className="w-4 h-4" />
                Try again
              </button>
              <Link to="/" className="btn-secondary inline-flex items-center gap-2">
                <Home className="w-4 h-4" />
                Go home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
