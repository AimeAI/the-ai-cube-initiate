import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  fullScreen = false, 
  message = "Loading..." 
}) => {
  const containerClass = fullScreen 
    ? "min-h-screen flex items-center justify-center bg-myth-background"
    : "flex items-center justify-center p-8";

  return (
    <div className={containerClass}>
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-myth-accent mx-auto mb-4" />
        <p className="text-myth-textSecondary">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;