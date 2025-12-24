
import React, { ReactNode, ErrorInfo, Component } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Fixed property access errors by explicitly defining state and props members
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // Explicit declarations to satisfy some TypeScript environments where inherited members aren't automatically typed
  public props: ErrorBoundaryProps;
  public state: ErrorBoundaryState;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    // Explicitly assigning props and state to satisfy property existence checks
    this.props = props;
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-8 text-center font-sans">
          <div className="bg-red-500/10 border border-red-500/50 p-8 rounded-2xl max-w-lg">
            <h1 className="text-2xl font-bold mb-4 text-red-500">System Error</h1>
            <p className="text-slate-300 mb-6">The application encountered a critical error and could not load.</p>
            <div className="bg-slate-950 p-4 rounded text-left text-xs text-red-300 font-mono mb-6 overflow-auto max-h-40">
                {this.state.error?.toString()}
            </div>
            <button 
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }} 
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
                Reset & Reload
            </button>
          </div>
        </div>
      );
    }

    // Fixed: Property 'props' is now explicitly declared and accessible
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
        <App />
    </ErrorBoundary>
  </React.StrictMode>
);
