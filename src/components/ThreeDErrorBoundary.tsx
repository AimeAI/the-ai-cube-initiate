import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  showRefresh?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

class ThreeDErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('3D Component Error:', error, errorInfo);
    this.setState({ error, errorInfo });
    
    // Report to monitoring service if available
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: `3D Error: ${error.message}`,
        fatal: false
      });
    }
  }

  handleRefresh = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 bg-void-black/50 backdrop-blur-md rounded-xl border border-red-500/30 text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">3D Content Unavailable</h3>
          <p className="text-gray-300 mb-4 max-w-md">
            We're having trouble loading the 3D content. This might be due to:
          </p>
          <ul className="text-sm text-gray-400 mb-6 text-left">
            <li>• WebGL not supported by your browser</li>
            <li>• Graphics drivers need updating</li>
            <li>• Hardware acceleration disabled</li>
            <li>• Insufficient graphics memory</li>
          </ul>
          
          {this.props.showRefresh !== false && (
            <button
              onClick={this.handleRefresh}
              className="flex items-center px-4 py-2 bg-electricCyan text-obsidianBlack rounded-lg hover:bg-neonMint transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
          )}
          
          <div className="mt-4 text-xs text-gray-500">
            <details>
              <summary className="cursor-pointer hover:text-gray-400">Technical Details</summary>
              <div className="mt-2 p-2 bg-black/30 rounded text-left font-mono text-xs">
                <p><strong>Error:</strong> {this.state.error?.message}</p>
                {this.state.error?.stack && (
                  <p className="mt-1"><strong>Stack:</strong> {this.state.error.stack.slice(0, 200)}...</p>
                )}
              </div>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easy wrapping
export const withThreeDErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) => {
  return (props: P) => (
    <ThreeDErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ThreeDErrorBoundary>
  );
};

// Hook to check WebGL support
export const useWebGLSupport = () => {
  const [isSupported, setIsSupported] = React.useState<boolean | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) {
        setError('WebGL is not supported by your browser');
        setIsSupported(false);
        return;
      }

      // Check for common WebGL extensions
      const extensions = [
        'OES_texture_float',
        'OES_texture_half_float',
        'WEBGL_depth_texture'
      ];

      const supportedExtensions = extensions.filter(ext => gl.getExtension(ext));
      
      if (supportedExtensions.length === 0) {
        setError('WebGL extensions not available');
      }

      setIsSupported(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown WebGL error');
      setIsSupported(false);
    }
  }, []);

  return { isSupported, error };
};

// Fallback component for 3D content
export const ThreeDFallback: React.FC<{ 
  title?: string; 
  description?: string;
  showWebGLCheck?: boolean;
}> = ({ 
  title = "3D Content", 
  description = "Interactive 3D content would appear here",
  showWebGLCheck = true
}) => {
  const { isSupported, error } = useWebGLSupport();

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-purple-900/20 to-cyan-900/20 rounded-xl border border-purple-500/30 text-center min-h-[300px]">
      <div className="w-16 h-16 bg-electricCyan/20 rounded-full flex items-center justify-center mb-4">
        <div className="w-8 h-8 border-2 border-electricCyan border-t-transparent rounded-full animate-spin"></div>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-300 mb-4">{description}</p>
      
      {showWebGLCheck && (
        <div className="text-sm text-gray-400">
          {isSupported === null && "Checking 3D support..."}
          {isSupported === true && "✅ 3D graphics supported"}
          {isSupported === false && (
            <div className="text-red-400">
              ❌ 3D graphics not available
              {error && <div className="mt-1 text-xs">{error}</div>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ThreeDErrorBoundary;
