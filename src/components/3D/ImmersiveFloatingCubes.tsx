import React, { useEffect, useState, useRef } from 'react';
import EnhancedRotatingCube from './EnhancedRotatingCube';

interface ImmersiveFloatingCubesProps {
  className?: string;
}

const ImmersiveFloatingCubes: React.FC<ImmersiveFloatingCubesProps> = ({ className = '' }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredCube, setHoveredCube] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollTop / docHeight;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track mouse position for dynamic effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Cube configurations with enhanced variety
  const cubeConfigs = [
    // Hero Section - Large focal cubes
    {
      id: 1,
      size: 140,
      speed: 0.008,
      color: '#00D4FF',
      variant: 'energy' as const,
      position: { top: '15%', right: '8%' },
      intensity: 1.2,
      parallaxSpeed: 0.3,
      delay: '0s'
    },
    {
      id: 2,
      size: 100,
      speed: 0.012,
      color: '#7C3AED',
      variant: 'hologram' as const,
      position: { top: '35%', left: '12%' },
      intensity: 0.9,
      parallaxSpeed: 0.5,
      delay: '1.2s'
    },
    {
      id: 3,
      size: 120,
      speed: 0.015,
      color: '#10B981',
      variant: 'neural' as const,
      position: { bottom: '25%', right: '20%' },
      intensity: 1.1,
      parallaxSpeed: 0.4,
      delay: '2.1s'
    },

    // Mid-section cubes with variety
    {
      id: 4,
      size: 90,
      speed: 0.01,
      color: '#F59E0B',
      variant: 'crystalline' as const,
      position: { top: '50%', left: '5%' },
      intensity: 0.8,
      parallaxSpeed: 0.6,
      delay: '0.8s'
    },
    {
      id: 5,
      size: 80,
      speed: 0.013,
      color: '#EF4444',
      variant: 'energy' as const,
      position: { bottom: '40%', left: '25%' },
      intensity: 1.0,
      parallaxSpeed: 0.7,
      delay: '1.8s'
    },
    {
      id: 6,
      size: 110,
      speed: 0.009,
      color: '#8B5CF6',
      variant: 'hologram' as const,
      position: { top: '70%', right: '15%' },
      intensity: 1.3,
      parallaxSpeed: 0.35,
      delay: '2.8s'
    },

    // Background ambient cubes
    {
      id: 7,
      size: 70,
      speed: 0.011,
      color: '#06B6D4',
      variant: 'neural' as const,
      position: { bottom: '15%', right: '35%' },
      intensity: 0.7,
      parallaxSpeed: 0.8,
      delay: '3.2s'
    },
    {
      id: 8,
      size: 60,
      speed: 0.016,
      color: '#F97316',
      variant: 'energy' as const,
      position: { top: '20%', left: '45%' },
      intensity: 0.6,
      parallaxSpeed: 0.9,
      delay: '3.8s'
    },
    {
      id: 9,
      size: 75,
      speed: 0.014,
      color: '#84CC16',
      variant: 'crystalline' as const,
      position: { bottom: '8%', left: '18%' },
      intensity: 0.8,
      parallaxSpeed: 0.65,
      delay: '4.2s'
    },

    // Additional complexity cubes
    {
      id: 10,
      size: 85,
      speed: 0.007,
      color: '#EC4899',
      variant: 'hologram' as const,
      position: { top: '85%', left: '35%' },
      intensity: 0.9,
      parallaxSpeed: 0.4,
      delay: '4.8s'
    },
    {
      id: 11,
      size: 65,
      speed: 0.018,
      color: '#14B8A6',
      variant: 'neural' as const,
      position: { top: '60%', right: '45%' },
      intensity: 0.7,
      parallaxSpeed: 0.75,
      delay: '5.1s'
    },
    {
      id: 12,
      size: 95,
      speed: 0.006,
      color: '#A855F7',
      variant: 'energy' as const,
      position: { bottom: '55%', left: '8%' },
      intensity: 1.0,
      parallaxSpeed: 0.3,
      delay: '5.6s'
    }
  ];

  const handleCubeHover = (cubeId: number, isHovered: boolean) => {
    setHoveredCube(isHovered ? cubeId : null);
  };

  return (
    <div 
      ref={containerRef}
      className={`immersive-floating-cubes ${className}`}
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
      {cubeConfigs.map((config) => {
        // Calculate dynamic positioning based on scroll and mouse
        const parallaxOffset = scrollProgress * config.parallaxSpeed * 100;
        const mouseInfluenceX = mousePosition.x * 20 * (config.intensity || 1);
        const mouseInfluenceY = mousePosition.y * 15 * (config.intensity || 1);
        
        // Enhanced hover effects
        const isHovered = hoveredCube === config.id;
        const nearbyHover = hoveredCube !== null && Math.abs(hoveredCube - config.id) <= 2;
        
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
                scale(${isHovered ? 1.15 : nearbyHover ? 1.05 : 1})
                rotate(${scrollProgress * 360 * 0.1}deg)
              `,
              transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: `
                brightness(${isHovered ? 1.4 : nearbyHover ? 1.2 : 1})
                saturate(${isHovered ? 1.3 : 1})
                blur(${Math.abs(mousePosition.x) > 0.8 || Math.abs(mousePosition.y) > 0.8 ? '1px' : '0px'})
              `,
              opacity: isHovered ? 1 : nearbyHover ? 0.9 : 0.8,
              animationDelay: config.delay,
              pointerEvents: 'auto'
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
              className="floating-cube-enhanced"
            />
            
            {/* Energy connections when hovered */}
            {isHovered && (
              <div 
                className="energy-connection"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '200px',
                  height: '200px',
                  transform: 'translate(-50%, -50%)',
                  background: `radial-gradient(circle, ${config.color}20 0%, transparent 70%)`,
                  borderRadius: '50%',
                  animation: 'pulse-energy 2s ease-in-out infinite',
                  pointerEvents: 'none'
                }}
              />
            )}
          </div>
        );
      })}

      {/* Particle field background */}
      <div 
        className="particle-field"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `
            radial-gradient(circle at 20% 80%, #00D4FF08 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, #7C3AED08 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, #10B98108 0%, transparent 50%)
          `,
          opacity: 0.6,
          animation: 'float-particles 20s ease-in-out infinite'
        }}
      />

      {/* Energy grid overlay */}
      <div 
        className="energy-grid"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `
            linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
          transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`,
          transition: 'transform 0.1s ease-out',
          opacity: 0.4
        }}
      />

      <style jsx>{`
        @keyframes float-particles {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.6;
          }
          33% {
            transform: translateY(-20px) rotate(120deg);
            opacity: 0.8;
          }
          66% {
            transform: translateY(-10px) rotate(240deg);
            opacity: 0.4;
          }
        }

        @keyframes pulse-energy {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.6;
          }
        }

        .cube-container:hover + .cube-container {
          transform: scale(1.02);
        }

        .floating-cube-enhanced {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .floating-cube-enhanced:hover {
          filter: brightness(1.3) saturate(1.2);
        }

        /* Performance optimizations */
        .immersive-floating-cubes {
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
        }

        .cube-container {
          will-change: transform, filter, opacity;
        }

        /* Responsive behavior */
        @media (max-width: 1200px) {
          .cube-container:nth-child(n+8) {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .cube-container:nth-child(n+5) {
            display: none;
          }
          .immersive-floating-cubes {
            opacity: 0.7;
          }
        }

        @media (max-width: 480px) {
          .cube-container:nth-child(n+3) {
            display: none;
          }
          .immersive-floating-cubes {
            opacity: 0.5;
          }
        }

        /* Respect motion preferences */
        @media (prefers-reduced-motion: reduce) {
          .immersive-floating-cubes,
          .cube-container,
          .energy-connection {
            animation: none !important;
            transition: none !important;
            transform: none !important;
          }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .immersive-floating-cubes {
            filter: contrast(1.5) brightness(1.2);
          }
        }
      `}</style>
    </div>
  );
};

export default ImmersiveFloatingCubes;