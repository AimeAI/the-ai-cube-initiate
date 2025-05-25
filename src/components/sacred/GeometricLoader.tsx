import React from 'react';

interface GeometricLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  // Future props can be added here, e.g., size, complexity, animationSpeed
  isLoading?: boolean;
}

const GeometricLoader: React.FC<GeometricLoaderProps> = ({
  isLoading = true,
  className,
  ...props
}) => {
  if (!isLoading) {
    return null;
  }

  // Placeholder for a geometric loader animation
  // This could be an SVG, a Three.js animation, or a complex CSS animation.
  // For now, a simple styled div.
  return (
    <div
      className={`
        flex items-center justify-center
        p-4
        ${className || ''}
      `}
      {...props}
    >
      <div
        className="
          w-16 h-16
          border-4 border-dashed border-axis-x
          rounded-full
          animate-spin
        "
        role="status"
        aria-live="polite"
        aria-label="Loading..."
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default GeometricLoader;