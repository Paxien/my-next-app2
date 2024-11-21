import React, { Component, ErrorInfo } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from './button';

interface Props {
  children: React.ReactNode;
  FallbackComponent?: React.ComponentType<FallbackProps>;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export interface FallbackProps {
  error: Error | null;
  resetErrorBoundary: () => void;
}

const DefaultFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div className="p-4 rounded-md bg-destructive/10 text-destructive">
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle className="h-4 w-4" />
        <h3 className="font-medium">Something went wrong</h3>
      </div>
      <p className="text-sm mb-4">{error?.message}</p>
      <Button
        variant="outline"
        size="sm"
        onClick={resetErrorBoundary}
      >
        Try again
      </Button>
    </div>
  );
};

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by error boundary:', error, errorInfo);
  }

  resetErrorBoundary = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    const { hasError, error } = this.state;
    const { children, FallbackComponent = DefaultFallback } = this.props;

    if (hasError) {
      return (
        <FallbackComponent
          error={error}
          resetErrorBoundary={this.resetErrorBoundary}
        />
      );
    }

    return children;
  }
}

export const ErrorFallback = DefaultFallback;
