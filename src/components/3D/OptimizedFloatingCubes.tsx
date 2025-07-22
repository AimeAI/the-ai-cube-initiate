import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

// Lazy load Three.js components
const EnhancedRotatingCube = React.lazy(() => import('./EnhancedRotatingCube'));

interface OptimizedFloatingCubesProps {
  className?: string;
}

const OptimizedFloatingCubes: React.FC<OptimizedFloatingCubesProps> = ({ className = '' }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredCube, setHoveredCube] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for performance
  const [intersectionRef, isIntersecting] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px'
  });

  // Throttled scroll handler
  const throttledScrollHandler = useMemo(() => {
    let ticking = false;
    return () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.pageYOffset;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = Math.min(scrollTop / docHeight, 1);
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };
  }, []);

  // Throttled mouse handler
  const throttledMouseHandler = useMemo(() => {
    let ticking = false;
    return (e: MouseEvent) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setMousePosition({
            x: (e.clientX / window.innerWidth) * 2 - 1,
            y: (e.clientY / window.innerHeight) * 2 - 1
          });
          ticking = false;
        });
        ticking = true;
      }
    };
  }, []);

  // Only enable events when visible
  useEffect(() => {
    if (!isIntersecting) return;

    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    window.addEventListener('mousemove', throttledMouseHandler, { passive: true });
    setIsVisible(true);

    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
      window.removeEventListener('mousemove', throttledMouseHandler);
    };
  }, [isIntersecting, throttledScrollHandler, throttledMouseHandler]);

  // Optimized cube configurations - fewer cubes for better performance
  const cubeConfigs = useMemo(() => [
    // High-impact cubes only
    {
      id: 1,
      size: 140,
      speed: 0.008,
      color: '#00D4FF',
      variant: 'energy' as const,
      position: { top: '15%', right: '8%' },
      intensity: 1.2,
      parallaxSpeed: 0.3,
      priority: 'high'
    },
    {
      id: 2,
      size: 120,
      speed: 0.015,
      color: '#10B981',
      variant: 'neural' as const,
      position: { bottom: '25%', right: '20%' },
      intensity: 1.1,
      parallaxSpeed: 0.4,
      priority: 'high'
    },
    {
      id: 3,
      size: 100,
      speed: 0.012,
      color: '#7C3AED',
      variant: 'hologram' as const,
      position: { top: '35%', left: '12%' },
      intensity: 0.9,
      parallaxSpeed: 0.5,
      priority: 'medium'
    },
    {
      id: 4,
      size: 90,
      speed: 0.01,
      color: '#F59E0B',
      variant: 'crystalline' as const,
      position: { top: '50%', left: '5%' },
      intensity: 0.8,
      parallaxSpeed: 0.6,
      priority: 'medium'
    },
    {
      id: 5,
      size: 110,
      speed: 0.009,
      color: '#8B5CF6',
      variant: 'hologram' as const,
      position: { top: '70%', right: '15%' },
      intensity: 1.3,
      parallaxSpeed: 0.35,
      priority: 'low'
    }
  ], []);

  // Filter cubes based on device capabilities
  const visibleCubes = useMemo(() => {
    const isMobile = window.innerWidth <= 768;
    const isLowPerformance = navigator.hardwareConcurrency <= 4;
    
    if (isMobile) {
      return cubeConfigs.filter(cube => cube.priority === 'high').slice(0, 2);
    }
    
    if (isLowPerformance) {
      return cubeConfigs.filter(cube => cube.priority !== 'low').slice(0, 3);
    }
    
    return cubeConfigs;
  }, [cubeConfigs]);

  const handleCubeHover = (cubeId: number, hovered: boolean) => {
    setHoveredCube(hovered ? cubeId : null);
  };

  if (!isVisible) {
    return (
      <div 
        ref={intersectionRef}
        className={`optimized-floating-cubes ${className}`}
        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
      />
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`optimized-floating-cubes ${className}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden'
      }}
    >
      <React.Suspense 
        fallback={
          <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            color: '#00D4FF',
            fontSize: '12px'
          }}>
            Loading 3D...
          </div>
        }
      >
        {visibleCubes.map((config) => {
          const parallaxOffset = scrollProgress * config.parallaxSpeed * 50; // Reduced multiplier
          const mouseInfluenceX = mousePosition.x * 10 * (config.intensity || 1); // Reduced influence
          const mouseInfluenceY = mousePosition.y * 8 * (config.intensity || 1);
          
          const isHovered = hoveredCube === config.id;
          const nearbyHover = hoveredCube !== null && Math.abs(hoveredCube - config.id) <= 1;
          
          return (
            <div
              key={config.id}
              className="cube-container"
              style={{
                position: 'absolute',
                ...config.position,
                transform: `
                  translate3d(
                    ${mouseInfluenceX}px, 
                    ${mouseInfluenceY - parallaxOffset}px, 
                    0
                  ) 
                  scale(${isHovered ? 1.1 : nearbyHover ? 1.05 : 1})
                `,
                transition: 'transform 0.2s ease-out', // Shortened transition
                filter: `brightness(${isHovered ? 1.3 : nearbyHover ? 1.1 : 1})`,
                opacity: isHovered ? 1 : nearbyHover ? 0.9 : 0.8,
                pointerEvents: 'auto',
                willChange: 'transform'
              }}
            >
              <EnhancedRotatingCube
                size={config.size}
                speed={config.speed}
                color={config.color}
                variant={config.variant}
                intensity={config.intensity}
                scrollProgress={scrollProgress}
                onHover={(hovered) => handleCubeHover(config.id, hovered)}
                className="optimized-cube"
              />
            </div>
          );
        })}
      </React.Suspense>

      {/* Simplified particle field - CSS only */}
      <div 
        className="particle-field"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `
            radial-gradient(circle at 20% 80%, #00D4FF06 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, #7C3AED06 0%, transparent 50%)
          `,
          opacity: 0.4,
          pointerEvents: 'none'
        }}
      />

      <style jsx>{`
        .optimized-floating-cubes {
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
        }
        
        .cube-container {
          will-change: transform;
          transform: translateZ(0);
        }
        
        .optimized-cube {
          will-change: transform;
        }
        
        /* Reduce complexity on mobile */
        @media (max-width: 768px) {
          .particle-field {
            display: none;
          }
          
          .cube-container:nth-child(n+3) {
            display: none;
          }
        }
        
        /* Respect motion preferences */
        @media (prefers-reduced-motion: reduce) {
          .optimized-floating-cubes *,
          .cube-container * {
            animation: none !important;
            transition: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default OptimizedFloatingCubes;