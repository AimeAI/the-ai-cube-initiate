import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface EnergyFieldProps {
  className?: string;
  intensity?: number;
  color?: string;
}

const EnergyField: React.FC<EnergyFieldProps> = ({
  className = '',
  intensity = 1.0,
  color = '#00D4FF'
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const animationFrameRef = useRef<number>();
  const timeRef = useRef(0);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: false, // Disabled for performance
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    // Energy field shader
    const energyFieldVertex = `
      uniform float time;
      uniform float intensity;
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        vUv = uv;
        vPosition = position;
        
        vec3 pos = position;
        float wave1 = sin(position.x * 2.0 + time) * 0.1;
        float wave2 = sin(position.y * 3.0 + time * 1.5) * 0.05;
        float wave3 = sin(position.z * 1.5 + time * 0.8) * 0.08;
        
        pos += normal * (wave1 + wave2 + wave3) * intensity;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    const energyFieldFragment = `
      uniform float time;
      uniform float intensity;
      uniform vec3 color;
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        vec2 center = vec2(0.5, 0.5);
        float dist = distance(vUv, center);
        
        float energy = sin(time * 2.0 + dist * 10.0) * 0.5 + 0.5;
        float ripple = sin(time * 3.0 + dist * 20.0) * 0.3 + 0.7;
        
        vec3 energyColor = color * energy * ripple * intensity;
        float alpha = (1.0 - dist) * 0.3 * intensity;
        
        gl_FragColor = vec4(energyColor, alpha);
      }
    `;

    // Create energy field geometry
    const fieldGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
    const fieldMaterial = new THREE.ShaderMaterial({
      vertexShader: energyFieldVertex,
      fragmentShader: energyFieldFragment,
      uniforms: {
        time: { value: 0 },
        intensity: { value: intensity },
        color: { value: new THREE.Color(color) }
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });

    const energyField = new THREE.Mesh(fieldGeometry, fieldMaterial);
    energyField.rotation.x = -Math.PI / 2;
    energyField.position.y = -2;
    scene.add(energyField);

    // Particle connections
    const connectionGeometry = new THREE.BufferGeometry();
    const connectionCount = 100;
    const positions = new Float32Array(connectionCount * 6); // 2 points per line
    const colors = new Float32Array(connectionCount * 6);

    for (let i = 0; i < connectionCount; i++) {
      const i6 = i * 6;
      
      // Random start and end points
      positions[i6] = (Math.random() - 0.5) * 20;
      positions[i6 + 1] = (Math.random() - 0.5) * 10;
      positions[i6 + 2] = (Math.random() - 0.5) * 20;
      
      positions[i6 + 3] = (Math.random() - 0.5) * 20;
      positions[i6 + 4] = (Math.random() - 0.5) * 10;
      positions[i6 + 5] = (Math.random() - 0.5) * 20;
      
      const baseColor = new THREE.Color(color);
      colors[i6] = baseColor.r;
      colors[i6 + 1] = baseColor.g;
      colors[i6 + 2] = baseColor.b;
      colors[i6 + 3] = baseColor.r * 0.5;
      colors[i6 + 4] = baseColor.g * 0.5;
      colors[i6 + 5] = baseColor.b * 0.5;
    }

    connectionGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    connectionGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const connectionMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending
    });

    const connections = new THREE.LineSegments(connectionGeometry, connectionMaterial);
    scene.add(connections);

    // Add to DOM
    mountRef.current.appendChild(renderer.domElement);

    // Handle resize
    const handleResize = () => {
      if (rendererRef.current) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      timeRef.current += 0.016;
      
      // Update shader uniforms
      fieldMaterial.uniforms.time.value = timeRef.current;
      
      // Animate connections
      const positions = connectionGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 6) {
        positions[i + 1] += Math.sin(timeRef.current + i) * 0.01;
        positions[i + 4] += Math.cos(timeRef.current + i + 3) * 0.01;
      }
      connectionGeometry.attributes.position.needsUpdate = true;
      
      connections.rotation.y += 0.001;

      if (rendererRef.current && sceneRef.current) {
        rendererRef.current.render(sceneRef.current, camera);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      window.removeEventListener('resize', handleResize);
      
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      
      // Dispose Three.js objects
      fieldGeometry.dispose();
      fieldMaterial.dispose();
      connectionGeometry.dispose();
      connectionMaterial.dispose();
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [intensity, color]);

  return (
    <div 
      ref={mountRef} 
      className={`energy-field ${className}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1,
        opacity: 0.4
      }}
    />
  );
};

export default EnergyField;