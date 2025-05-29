import React, { useEffect, useRef } from 'react';

interface MysticalBackgroundProps extends React.HTMLAttributes<HTMLCanvasElement> {
  isActive?: boolean;
  particleColorVars?: string[]; // Allow custom particle color CSS variables
  particleCount?: number;
}

const MysticalBackground: React.FC<MysticalBackgroundProps> = ({
  isActive = true,
  className,
  particleColorVars = ['--electricCyan', '--neonMint', '--deepViolet'], // Default to new theme colors
  particleCount = 50,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const particles: { x: number; y: number; radius: number; vx: number; vy: number; color: string }[] = [];
    
    const getCssVariableValue = (cssVar: string) => {
      // Ensure it's a valid CSS variable name (starts with --)
      if (cssVar.startsWith('--')) {
        return getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
      }
      return cssVar; // Return as is if not a variable (e.g., direct hex code)
    }

    const resolvedColors = particleColorVars.map(getCssVariableValue);

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      canvas.width = parent ? parent.clientWidth : window.innerWidth;
      canvas.height = parent ? parent.clientHeight : window.innerHeight;
      
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5 + 0.5, // Slightly smaller particles
          vx: Math.random() * 0.6 - 0.3, // Slower movement
          vy: Math.random() * 0.6 - 0.3, // Slower movement
          color: resolvedColors[Math.floor(Math.random() * resolvedColors.length)],
        });
      }
    };

    const draw = () => {
      if (!ctx || !canvasRef.current) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color; // Use pre-resolved color
        // Add a subtle glow to particles
        ctx.shadowBlur = 5;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadowBlur

        p.x += p.vx;
        p.y += p.vy;

        if (p.x - p.radius < 0 || p.x + p.radius > canvas.width) p.vx *= -1;
        if (p.y - p.radius < 0 || p.y + p.radius > canvas.height) p.vy *= -1;
      });
      animationFrameId = requestAnimationFrame(draw);
    };

    resizeCanvas();
    // Initial call to resolve colors based on current CSS variables
    // This is important if CSS variables might change after initial load
    // (though for theme colors, they are usually set once)
    const updateColorsAndRedraw = () => {
      resolvedColors.length = 0;
      particleColorVars.forEach(cssVar => resolvedColors.push(getCssVariableValue(cssVar)));
      // No need to call draw() here as it's self-looping,
      // but if particles needed immediate color update, you might re-init them or update their color property.
    };
    
    // Call once to initialize colors correctly
    updateColorsAndRedraw();

    draw();

    window.addEventListener('resize', resizeCanvas);
    // Potentially listen for theme changes if CSS variables could change dynamically
    // document.addEventListener('themeChanged', updateColorsAndRedraw);


    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      // document.removeEventListener('themeChanged', updateColorsAndRedraw);
    };
  }, [isActive, particleColorVars, particleCount]); // Add particleCount to dependencies

  if (!isActive) {
    return null;
  }
  
  return (
    <canvas
      ref={canvasRef}
      className={`absolute top-0 left-0 w-full h-full -z-10 pointer-events-none ${className || ''}`}
      {...props}
    />
  );
};

export default MysticalBackground;