import React from "react" 

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props) 
    this.state = { hasError: false } 
  }

  static getDerivedStateFromError(error) {
    return { hasError: true } 
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service here
    console.error("ErrorBoundary caught an error:", error, errorInfo) 
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <h1>Oops! Something went wrong.</h1>
          <p>Sorry, the app encountered an error. Please try again later.</p>
        </div>
      ) 
    }
    return this.props.children 
  }
}

export default ErrorBoundary 
