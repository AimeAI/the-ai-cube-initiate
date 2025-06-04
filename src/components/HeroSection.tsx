import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import SacredButton from './sacred/SacredButton';

// Sacred geometry background pattern
const MetatronsCube: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="40" stroke="#8B5FFF" strokeWidth="0.5" fill="none" opacity="0.3" />
    <circle cx="50" cy="50" r="25" stroke="#00D4FF" strokeWidth="0.5" fill="none" opacity="0.4" />
    <circle cx="50" cy="50" r="12" stroke="#FF6B35" strokeWidth="0.5" fill="none" opacity="0.5" />
    <polygon 
      points="50,20 65,35 65,65 50,80 35,65 35,35" 
      stroke="#FFD700" 
      strokeWidth="0.3" 
      fill="none" 
      opacity="0.2"
    />
  </svg>
);

// Sacred floating cube with proper animations
const SacredFloatingCube: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current && outerRef.current) {
      // Golden ratio rotation speeds
      meshRef.current.rotation.x += delta * 0.4;
      meshRef.current.rotation.y += delta * 0.25;
      meshRef.current.rotation.z += delta * 0.15;
      
      // Outer cube counter-rotation
      outerRef.current.rotation.x -= delta * 0.2;
      outerRef.current.rotation.y -= delta * 0.3;
      
      // Sacred floating motion
      const time = state.clock.getElapsedTime();
      meshRef.current.position.y = Math.sin(time * 0.8) * 0.3;
      outerRef.current.position.y = Math.cos(time * 0.6) * 0.2;
    }
  });

  return (
    <group>
      {/* Inner sacred cube */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <boxGeometry args={[24, 24, 24]} /> {/* Doubled size again */}
        <meshStandardMaterial
          color="#00D4FF"
          transparent
          opacity={0.6}
          wireframe={true}
          emissive="#00D4FF"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Outer mystical frame */}
      <mesh ref={outerRef} position={[0, 0, 0]}>
        <boxGeometry args={[40, 40, 40]} /> {/* Doubled size again */}
        <meshStandardMaterial
          color="#8B5FFF"
          transparent
          opacity={0.3}
          wireframe={true}
          emissive="#8B5FFF"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Sacred center point */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.6, 16, 16]} /> {/* Doubled size again */}
        <meshStandardMaterial 
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
};

// Enhanced particle field with sacred geometry
const SacredParticleField: React.FC<{ count?: number }> = ({ count = 200 }) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const positions = React.useMemo(() => {
    const verts = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Sacred spiral distribution
      const theta = i * 2.39996; // Golden angle
      const y = 1 - (i / count) * 2;
      const radius = Math.sqrt(1 - y * y) * 8;
      
      verts[i * 3] = Math.cos(theta) * radius;
      verts[i * 3 + 1] = y * 8;
      verts[i * 3 + 2] = Math.sin(theta) * radius;
      
      // Sacred color variation
      const colorChoice = Math.random();
      if (colorChoice < 0.4) {
        // Cyan particles
        colors[i * 3] = 0;
        colors[i * 3 + 1] = 0.8;
        colors[i * 3 + 2] = 1;
      } else if (colorChoice < 0.7) {
        // Violet particles  
        colors[i * 3] = 0.5;
        colors[i * 3 + 1] = 0.4;
        colors[i * 3 + 2] = 1;
      } else {
        // Golden particles
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0.8;
        colors[i * 3 + 2] = 0;
      }
    }
    
    return { positions: verts, colors };
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
      pointsRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1;
    }
  });

  return (
    <Points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={count} 
          array={positions.positions} 
          itemSize={3} 
        />
        <bufferAttribute 
          attach="attributes-color" 
          count={count} 
          array={positions.colors} 
          itemSize={3} 
        />
      </bufferGeometry>
      <PointMaterial 
        size={0.03} 
        transparent 
        opacity={0.8} 
        sizeAttenuation
        vertexColors
      />
    </Points>
  );
};

// Error boundary for 3D components
interface Canvas3DErrorBoundaryProps {
  children: React.ReactNode;
  t: (key: string) => string; // Add t function to props
}

class Canvas3DErrorBoundary extends React.Component<
  Canvas3DErrorBoundaryProps, // Use the new props interface
  { hasError: boolean }
> {
  constructor(props: Canvas3DErrorBoundaryProps) { // Use the new props interface
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.log('3D Canvas Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white/50">
            <div className="w-32 h-32 border border-cyan-500/30 mx-auto mb-4 flex items-center justify-center">
              <span className="text-cyan-400">◊</span>
            </div>
            <p className="text-sm">{this.props.t('hero.sacredGeometryLoading')}</p> {/* Use this.props.t */}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const HeroSection = () => {
  const { t } = useTranslation();
  return (
  <section id="philosophy" className="min-h-screen relative overflow-hidden bg-void-black flex flex-col justify-center items-center p-4"> {/* Added padding */}
    {/* Sacred geometry background */}
    <MetatronsCube className="absolute inset-0 w-full h-full opacity-10 md:opacity-15 -z-10" />
    
    {/* Radial gradient overlay */}
    <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/50 -z-5"></div>

    {/* Main content wrapper */}
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full text-center">
      
      {/* Sacred 3D Canvas - Centered and Sized */}
      <div className="w-full max-w-md h-64 md:h-80 mb-8"> {/* Adjusted size and added margin */}
        <Canvas3DErrorBoundary t={t}> {/* Pass t as a prop */}
          <Canvas
            camera={{ position: [0, 0, 80], fov: 50 }} // Adjusted camera for doubled cube
            gl={{ antialias: true, alpha: true }}
          >
            <ambientLight intensity={0.5} /> {/* Slightly increased ambient light */}
            <pointLight position={[8, 8, 8]} intensity={0.7} color="#FFFFFF" /> {/* White light */}
            <pointLight position={[-8, -8, 4]} intensity={0.3} color="#CCCCCC" /> {/* Softer white light */}
            
            <React.Suspense fallback={null}>
              <SacredFloatingCube />
              <SacredParticleField count={100} /> {/* Reduced particle count for performance */}
            </React.Suspense>
          </Canvas>
        </Canvas3DErrorBoundary>
      </div>

      {/* Text Content */}
      <div className="max-w-3xl px-4"> {/* Adjusted max-width and padding */}
        <h1
          className="
            text-5xl md:text-6xl font-orbitron font-black /* Reduced text size */
            text-white mb-4 /* Changed to white text */
            tracking-wide /* Adjusted tracking */
          "
          style={{
            textShadow: '0 0 8px rgba(255, 255, 255, 0.7)', // Refined white glow for a cleaner look
          }}
        >
          {t('hero.title')}
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-6 leading-relaxed font-orbitron"> {/* Adjusted text color and margin */}
          {t('hero.tagline')}
        </p>
        <p className="text-xl md:text-2xl text-cyan-400 mb-10 leading-relaxed font-orbitron"> {/* New subheading style */}
          {t('hero.subheading')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center"> {/* Adjusted gap and flex for smaller screens */}
          <SacredButton variant="primary" size="large" href="http://localhost:8080/payment">
            {t('hero.buttonQuest')}
          </SacredButton>
          <SacredButton variant="secondary" size="large" href="/codekeepers">
            {t('hero.buttonBlueprint')}
          </SacredButton>
        </div>
        <p className="text-sm text-gray-400 mt-6 font-orbitron"> {/* Optional caption */}
          {t('hero.caption')}
        </p>
      </div>
    </div>
  </section>
  );
};

export default HeroSection;