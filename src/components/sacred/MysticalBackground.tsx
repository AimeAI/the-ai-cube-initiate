import React, { useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber'; // Added R3F Canvas

interface MysticalBackgroundProps extends React.HTMLAttributes<HTMLDivElement> { // Changed HTMLCanvasElement to HTMLDivElement for the wrapper
  isActive?: boolean;
}

// This component will now be a R3F component, but will render the 2D canvas inside.
// For a true 3D mystical background, the particle logic would need to be implemented with R3F primitives.
const MysticalCanvas2D: React.FC<React.HTMLAttributes<HTMLCanvasElement> & { isActive: boolean }> = ({ isActive, className, ...props }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const particles: { x: number; y: number; radius: number; vx: number; vy: number; color: string }[] = [];
    const particleCount = 50;
    const colors = ['var(--axis-x)', 'var(--axis-y)', 'var(--axis-z)', 'var(--energy-glow)'];

    const resizeCanvas = () => {
      // Ensure parent dimensions are available if canvas is not directly sized by window
      const parent = canvas.parentElement;
      canvas.width = parent ? parent.clientWidth : window.innerWidth;
      canvas.height = parent ? parent.clientHeight : window.innerHeight;
      
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 1,
          vx: Math.random() * 1 - 0.5,
          vy: Math.random() * 1 - 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    const draw = () => {
      if (!ctx || !canvasRef.current) return; // Ensure ctx and canvas are still valid
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        const computedColor = getComputedStyle(document.documentElement).getPropertyValue(p.color.slice(4, -1)).trim();
        ctx.fillStyle = computedColor || p.color;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });
      animationFrameId = requestAnimationFrame(draw);
    };

    resizeCanvas();
    draw();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isActive]);

  if (!isActive) {
    return null;
  }
  
  // The canvas element itself, to be rendered by html.Div
  return (
    <canvas
      ref={canvasRef}
      className={`absolute top-0 left-0 w-full h-full ${className || ''}`} // Removed -z-10 as it will be controlled by R3F scene graph
      {...props}
    />
  );
};


const MysticalBackground: React.FC<MysticalBackgroundProps> = ({
  isActive = true,
  className, // className will be passed to the outer div
  ...props // other props will be passed to the outer div
}) => {
  if (!isActive) {
    return null;
  }

  // Wrap the 2D canvas logic in an R3F Canvas for better integration/error handling within R3F scenes
  return (
    <div className={`absolute top-0 left-0 w-full h-full -z-10 ${className || ''}`} {...props}>
      <Canvas orthographic camera={{ zoom: 1, position: [0, 0, 100] }} style={{ background: 'transparent' }}>
        <Suspense fallback={null}>
          {/* Use a simple plane or html element to host the 2D canvas */}
          {/* This is a conceptual bridge; a true 3D background would be different */}
          <primitive object={new THREE.Object3D()} /> {/* Placeholder to make R3F happy, actual drawing is on the 2D canvas */}
        </Suspense>
      </Canvas>
      {/* The 2D canvas is rendered outside the R3F Canvas but positioned with it */}
      {/* This is a workaround. For true R3F integration, particles should be R3F objects. */}
      <MysticalCanvas2D isActive={isActive} className="pointer-events-none" />
    </div>
  );
};

export default MysticalBackground;