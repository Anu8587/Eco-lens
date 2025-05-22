import React from 'react';

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-6 bg-[#f4a261]/20 rounded-lg m-4">
          <p className="text-[#f4a261] text-lg font-inter">
            Something went wrong while rendering this component.
          </p>
          <p className="text-[#2f3b2f] text-sm mt-2">
            Please refresh the page or try again later.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;