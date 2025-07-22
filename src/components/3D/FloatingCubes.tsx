import React from 'react';
import RotatingCube from './RotatingCube';

interface FloatingCubesProps {
  className?: string;
}

const FloatingCubes: React.FC<FloatingCubesProps> = ({ className = '' }) => {
  return (
    <div className={`floating-cubes-container ${className}`}>
      {/* Hero Section Cube - Large */}
      <div className="absolute top-20 right-10 animate-float" style={{ animationDelay: '0s' }}>
        <RotatingCube 
          size={120}
          speed={0.008}
          color="#00D4FF"
          wireframe={false}
          className="opacity-80 hover:opacity-100 transition-opacity duration-300"
        />
      </div>

      {/* Hero Section Cube - Medium */}
      <div className="absolute top-40 left-16 animate-float" style={{ animationDelay: '1s' }}>
        <RotatingCube 
          size={80}
          speed={0.012}
          color="#7C3AED"
          wireframe={true}
          className="opacity-60 hover:opacity-90 transition-opacity duration-300"
        />
      </div>

      {/* Hero Section Cube - Small */}
      <div className="absolute bottom-32 right-1/4 animate-float" style={{ animationDelay: '2s' }}>
        <RotatingCube 
          size={60}
          speed={0.015}
          color="#10B981"
          wireframe={false}
          className="opacity-70 hover:opacity-95 transition-opacity duration-300"
        />
      </div>

      {/* Features Section Cubes */}
      <div className="absolute top-1/2 left-8 animate-float" style={{ animationDelay: '0.5s' }}>
        <RotatingCube 
          size={90}
          speed={0.01}
          color="#F59E0B"
          wireframe={true}
          className="opacity-50 hover:opacity-80 transition-opacity duration-300"
        />
      </div>

      <div className="absolute bottom-20 left-1/3 animate-float" style={{ animationDelay: '1.5s' }}>
        <RotatingCube 
          size={70}
          speed={0.013}
          color="#EF4444"
          wireframe={false}
          className="opacity-65 hover:opacity-90 transition-opacity duration-300"
        />
      </div>

      {/* Testimonials Section Cube */}
      <div className="absolute top-3/4 right-12 animate-float" style={{ animationDelay: '2.5s' }}>
        <RotatingCube 
          size={85}
          speed={0.009}
          color="#8B5CF6"
          wireframe={true}
          className="opacity-55 hover:opacity-85 transition-opacity duration-300"
        />
      </div>

      {/* Pricing Section Cubes */}
      <div className="absolute bottom-10 right-1/5 animate-float" style={{ animationDelay: '3s' }}>
        <RotatingCube 
          size={75}
          speed={0.011}
          color="#06B6D4"
          wireframe={false}
          className="opacity-60 hover:opacity-90 transition-opacity duration-300"
        />
      </div>

      <div className="absolute top-16 left-1/2 animate-float" style={{ animationDelay: '3.5s' }}>
        <RotatingCube 
          size={55}
          speed={0.016}
          color="#F97316"
          wireframe={true}
          className="opacity-45 hover:opacity-75 transition-opacity duration-300"
        />
      </div>

      {/* Footer Area Cube */}
      <div className="absolute bottom-4 left-20 animate-float" style={{ animationDelay: '4s' }}>
        <RotatingCube 
          size={65}
          speed={0.014}
          color="#84CC16"
          wireframe={false}
          className="opacity-50 hover:opacity-80 transition-opacity duration-300"
        />
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-10px) rotate(90deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
          75% {
            transform: translateY(-10px) rotate(270deg);
          }
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .floating-cubes-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .floating-cubes-container > div {
          pointer-events: auto;
        }

        /* Hide on mobile for performance */
        @media (max-width: 768px) {
          .floating-cubes-container > div:nth-child(n+4) {
            display: none;
          }
        }

        /* Hide more cubes on small mobile */
        @media (max-width: 480px) {
          .floating-cubes-container > div:nth-child(n+2) {
            display: none;
          }
        }

        /* Responsive positioning */
        @media (max-width: 1024px) {
          .floating-cubes-container > div {
            transform: scale(0.8);
          }
        }

        @media (max-width: 768px) {
          .floating-cubes-container > div {
            transform: scale(0.6);
          }
        }
      `}</style>
    </div>
  );
};

export default FloatingCubes;