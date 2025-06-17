import React from 'react';

interface LoadingFallbackProps {
  message?: string;
  className?: string;
}

const LoadingFallback: React.FC<LoadingFallbackProps> = ({ 
  message = "Loading...", 
  className = "" 
}) => {
  return (
    <div className={`min-h-screen bg-myth-background flex items-center justify-center ${className}`}>
      <div className="text-center">
        <div 
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-myth-accent mx-auto mb-4"
          role="status"
          aria-label="Loading content"
        ></div>
        <p className="text-myth-textSecondary" aria-live="polite">{message}</p>
      </div>
    </div>
  );
};

export default LoadingFallback;