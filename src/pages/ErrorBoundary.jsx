import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ error });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    // Optional: trigger a reload or navigate
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-6">
          <h1 className="text-3xl font-semibold mb-4">Oops! Something went wrong.</h1>
          <p className="text-lg mb-2">
            We encountered an unexpected error. Please try refreshing the page or come back later.
          </p>
          
          <button
            onClick={this.handleReset}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;