import { Component } from "react";

export default class GlobalErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    console.error("Global error:", error);
    console.error("Error info:", errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-4">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold">Something went wrong</h1>
            <p className="mb-4 text-gray-600">
              We apologize for the inconvenience. Please try refreshing the
              page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Refresh Page
            </button>
            {import.meta.env.DEV && (
              <div className="mt-4 rounded bg-gray-100 p-4 text-left">
                <p className="font-mono text-red-500">
                  {this.state.error?.toString()}
                </p>
                <pre className="mt-2 text-sm">
                  {this.state.errorInfo?.componentStack}
                </pre>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
