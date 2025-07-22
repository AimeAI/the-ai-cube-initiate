import React, { useRef, useEffect, useState } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface OptimizedEnergyFieldProps {
  className?: string;
  intensity?: number;
  color?: string;
}

const OptimizedEnergyField: React.FC<OptimizedEnergyFieldProps> = ({
  className = '',
  intensity = 1.0,
  color = '#00D4FF'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [intersectionRef, isIntersecting] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px'
  });

  // Only initialize Three.js when visible
  useEffect(() => {
    if (isIntersecting) {
      setIsVisible(true);
    }
  }, [isIntersecting]);

  // Fallback to CSS-only implementation for better performance
  if (!isVisible) {
    return (
      <div 
        ref={intersectionRef}
        className={`optimized-energy-field ${className}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: -1,
          background: `
            radial-gradient(circle at 25% 25%, ${color}08 0%, transparent 70%),
            radial-gradient(circle at 75% 75%, ${color}06 0%, transparent 70%),
            radial-gradient(circle at 50% 50%, ${color}04 0%, transparent 90%)
          `,
          opacity: intensity * 0.3
        }}
      />
    );
  }

  return (
    <div 
      className={`optimized-energy-field ${className}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1
      }}
    >
      {/* Animated CSS background - much lighter than Three.js */}
      <div 
        className="energy-background"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `
            radial-gradient(circle at 25% 25%, ${color}12 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, ${color}08 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, ${color}06 0%, transparent 60%)
          `,
          opacity: intensity * 0.4,
          animation: 'energy-pulse 8s ease-in-out infinite'
        }}
      />
      
      {/* Grid overlay */}
      <div 
        className="energy-grid"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `
            linear-gradient(${color}03 1px, transparent 1px),
            linear-gradient(90deg, ${color}03 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          opacity: intensity * 0.2,
          animation: 'grid-flow 20s linear infinite'
        }}
      />

      <style jsx>{`
        @keyframes energy-pulse {
          0%, 100% {
            transform: scale(1) rotate(0deg);
            opacity: ${intensity * 0.4};
          }
          33% {
            transform: scale(1.05) rotate(1deg);
            opacity: ${intensity * 0.6};
          }
          66% {
            transform: scale(0.95) rotate(-1deg);
            opacity: ${intensity * 0.3};
          }
        }

        @keyframes grid-flow {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }

        .optimized-energy-field {
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
        }

        /* Reduce effects on mobile */
        @media (max-width: 768px) {
          .energy-grid {
            display: none;
          }
          
          .energy-background {
            opacity: ${intensity * 0.2} !important;
          }
        }

        /* Respect motion preferences */
        @media (prefers-reduced-motion: reduce) {
          .energy-background,
          .energy-grid {
            animation: none !important;
            transform: none !important;
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .energy-background,
          .energy-grid {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default OptimizedEnergyField;