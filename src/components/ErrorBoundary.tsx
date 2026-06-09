import { Component, type ReactNode, type ErrorInfo } from 'react';
import Button from './ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4 gradient-leaf-radial">
          <div className="max-w-md w-full text-center animate-fade-in">
            <div className="w-20 h-20 rounded-2xl bg-danger/10 flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl" aria-hidden="true">⚠️</span>
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              An unexpected error occurred. Please try again.
            </p>
            {this.state.error && (
              <p className="text-xs text-[var(--text-muted)] bg-[var(--bg-card-hover)] rounded-xl p-3 mb-6 font-mono break-all">
                {this.state.error.message}
              </p>
            )}
            <div className="flex gap-3 justify-center">
              <Button variant="primary" onClick={this.handleReset}>
                Try Again
              </Button>
              <Button variant="secondary" onClick={() => window.location.reload()}>
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
