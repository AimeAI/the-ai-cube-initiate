import React, { Suspense } from 'react';
import { GeometricLoader } from './sacred/GeometricLoader';

// Lazy load Three.js Canvas to reduce initial bundle size
const LazyCanvas = React.lazy(async () => {
  const [canvasModule, fiberModule] = await Promise.all([
    import('@react-three/fiber'),
    import('three')
  ]);
  
  return {
    default: canvasModule.Canvas
  };
});

interface LazyThreeSceneProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Lazy-loaded Three.js Canvas wrapper with fallback loading
 * Reduces initial bundle size by deferring Three.js loading
 */
const LazyThreeScene: React.FC<LazyThreeSceneProps> = ({ 
  children, 
  className, 
  style 
}) => {
  return (
    <Suspense 
      fallback={
        <div className={className} style={style}>
          <GeometricLoader />
        </div>
      }
    >
      <LazyCanvas 
        className={className}
        style={style}
        dpr={[1, 2]} // Limit pixel ratio for performance
        performance={{ min: 0.5 }} // Enable automatic degradation
        frameloop="demand" // Only render when needed
      >
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </LazyCanvas>
    </Suspense>
  );
};

export default LazyThreeScene;