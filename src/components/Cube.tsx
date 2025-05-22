
import React, { useRef, useEffect } from 'react';

const CubeComponent: React.FC<{ scale?: number }> = ({ scale = 1 }) => {
  const cubeRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const createFragment = () => {
      if (!containerRef.current) return;
      
      const fragment = document.createElement('div');
      fragment.classList.add('fragment');
      
      // Random position around the cube
      const angle = Math.random() * Math.PI * 2;
      const distance = 100 + Math.random() * 150;
      const top = 50 + Math.sin(angle) * distance;
      const left = 50 + Math.cos(angle) * distance;
      
      // Apply styles
      fragment.style.top = `${top}%`;
      fragment.style.left = `${left}%`;
      
      // Random animation duration and delay
      const duration = 15 + Math.random() * 30;
      const delay = Math.random() * -30;
      fragment.style.animationDuration = `${duration}s`;
      fragment.style.animationDelay = `${delay}s`;
      fragment.style.opacity = `${0.3 + Math.random() * 0.7}`;
      fragment.style.transform = `rotate(0deg) translateX(${distance}px) rotate(0deg)`;
      
      containerRef.current.appendChild(fragment);
      
      // Remove fragment after some time to prevent too many elements
      setTimeout(() => {
        if (fragment.parentNode) {
          fragment.parentNode.removeChild(fragment);
        }
      }, duration * 1000);
    };
    
    // Create initial fragments
    for (let i = 0; i < 20; i++) {
      createFragment();
    }
    
    // Create new fragments periodically
    const intervalId = setInterval(createFragment, 1000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  
  return (
    <div ref={containerRef} className="w-full h-full relative cube-container">
      <div 
        ref={cubeRef} 
        className={`relative w-64 h-64 transform-style-preserve-3d animate-cube-rotate mx-auto`}
        style={{ 
          transform: `scale(${scale}) rotateX(0deg) rotateY(0deg)`,
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Front face */}
        <div className="cube-face" style={{ transform: 'translateZ(8rem)' }}></div>
        {/* Back face */}
        <div className="cube-face" style={{ transform: 'rotateY(180deg) translateZ(8rem)' }}></div>
        {/* Right face */}
        <div className="cube-face" style={{ transform: 'rotateY(90deg) translateZ(8rem)' }}></div>
        {/* Left face */}
        <div className="cube-face" style={{ transform: 'rotateY(-90deg) translateZ(8rem)' }}></div>
        {/* Top face */}
        <div className="cube-face" style={{ transform: 'rotateX(90deg) translateZ(8rem)' }}></div>
        {/* Bottom face */}
        <div className="cube-face" style={{ transform: 'rotateX(-90deg) translateZ(8rem)' }}></div>
      </div>
    </div>
  );
};

export default CubeComponent;
