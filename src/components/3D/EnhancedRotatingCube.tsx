import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';

interface EnhancedRotatingCubeProps {
  size?: number;
  speed?: number;
  color?: string;
  variant?: 'hologram' | 'energy' | 'crystalline' | 'neural' | 'quantum';
  intensity?: number;
  className?: string;
  style?: React.CSSProperties;
  onHover?: (isHovered: boolean) => void;
  scrollProgress?: number;
}

const EnhancedRotatingCube: React.FC<EnhancedRotatingCubeProps> = ({
  size = 100,
  speed = 0.01,
  color = '#00D4FF',
  variant = 'energy',
  intensity = 1.0,
  className = '',
  style = {},
  onHover,
  scrollProgress = 0
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cubeRef = useRef<THREE.Mesh>();
  const outerCubeRef = useRef<THREE.Mesh>();
  const particleSystemRef = useRef<THREE.Points>();
  const animationFrameRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);
  const isHoveredRef = useRef(false);

  // Shader materials for different variants
  const shaderMaterials = useMemo(() => {
    const baseColor = new THREE.Color(color);
    
    const hologramVertex = `
      uniform float time;
      uniform float intensity;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        
        vec3 pos = position;
        pos += normal * sin(position.y * 10.0 + time * 3.0) * 0.05 * intensity;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    const hologramFragment = `
      uniform vec3 color;
      uniform float time;
      uniform float intensity;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      void main() {
        float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
        float scan = sin(vPosition.y * 20.0 + time * 5.0) * 0.5 + 0.5;
        float flicker = sin(time * 30.0) * 0.1 + 0.9;
        
        vec3 finalColor = color * (fresnel + scan * 0.3) * flicker * intensity;
        gl_FragColor = vec4(finalColor, fresnel * 0.8 + scan * 0.2);
      }
    `;

    const energyVertex = `
      uniform float time;
      uniform float intensity;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        
        vec3 pos = position;
        float energy = sin(time * 2.0 + length(position) * 5.0) * 0.02 * intensity;
        pos += normal * energy;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    const energyFragment = `
      uniform vec3 color;
      uniform float time;
      uniform float intensity;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      void main() {
        float energy = sin(time * 3.0 + vPosition.x * 8.0) * sin(time * 2.0 + vPosition.y * 6.0);
        float pulse = sin(time * 4.0) * 0.3 + 0.7;
        
        vec3 energyColor = color + vec3(energy * 0.2, energy * 0.1, -energy * 0.1);
        energyColor *= pulse * intensity;
        
        float alpha = 0.7 + energy * 0.3;
        gl_FragColor = vec4(energyColor, alpha);
      }
    `;

    const neuralVertex = `
      uniform float time;
      uniform float intensity;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        
        vec3 pos = position;
        float neural = sin(time + position.x * 3.0) * sin(time * 1.5 + position.y * 2.0) * sin(time * 0.8 + position.z * 4.0);
        pos += normal * neural * 0.03 * intensity;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    const neuralFragment = `
      uniform vec3 color;
      uniform float time;
      uniform float intensity;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      void main() {
        vec2 grid = fract(vPosition.xy * 8.0) - 0.5;
        float neuralPattern = exp(-dot(grid, grid) * 50.0);
        float signal = sin(time * 6.0 + length(vPosition) * 10.0) * 0.5 + 0.5;
        
        vec3 neuralColor = color * (neuralPattern + signal * 0.5) * intensity;
        float alpha = 0.6 + neuralPattern * 0.4 + signal * 0.2;
        
        gl_FragColor = vec4(neuralColor, alpha);
      }
    `;

    return {
      hologram: new THREE.ShaderMaterial({
        vertexShader: hologramVertex,
        fragmentShader: hologramFragment,
        uniforms: {
          time: { value: 0 },
          color: { value: baseColor },
          intensity: { value: intensity }
        },
        transparent: true,
        side: THREE.DoubleSide
      }),
      energy: new THREE.ShaderMaterial({
        vertexShader: energyVertex,
        fragmentShader: energyFragment,
        uniforms: {
          time: { value: 0 },
          color: { value: baseColor },
          intensity: { value: intensity }
        },
        transparent: true,
        blending: THREE.AdditiveBlending
      }),
      neural: new THREE.ShaderMaterial({
        vertexShader: neuralVertex,
        fragmentShader: neuralFragment,
        uniforms: {
          time: { value: 0 },
          color: { value: baseColor },
          intensity: { value: intensity }
        },
        transparent: true
      })
    };
  }, [color, intensity]);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 4;

    // Renderer setup with enhanced effects
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Main cube with enhanced geometry
    const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5, 4, 4, 4); // Higher subdivisions
    
    // Apply selected material variant
    let material = shaderMaterials[variant] || shaderMaterials.energy;
    
    // For crystalline variant, use special setup
    if (variant === 'crystalline') {
      material = new THREE.MeshPhysicalMaterial({
        color: color,
        metalness: 0.9,
        roughness: 0.1,
        transmission: 0.5,
        thickness: 0.5,
        ior: 2.4,
        transparent: true,
        opacity: 0.8
      });
    }

    const cube = new THREE.Mesh(geometry, material);
    cubeRef.current = cube;
    scene.add(cube);

    // Outer wireframe cube for complexity
    const wireframeGeometry = new THREE.BoxGeometry(2.2, 2.2, 2.2);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: color,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const outerCube = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    outerCubeRef.current = outerCube;
    scene.add(outerCube);

    // Particle system for energy effects
    const particleCount = 200;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // Create particles in sphere around cube
      const radius = 3 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      
      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
      
      const baseColor = new THREE.Color(color);
      colors[i3] = baseColor.r;
      colors[i3 + 1] = baseColor.g;
      colors[i3 + 2] = baseColor.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.05,
      transparent: true,
      opacity: 0.6,
      vertexColors: true,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    particleSystemRef.current = particleSystem;
    scene.add(particleSystem);

    // Dynamic lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(color, 1, 10);
    pointLight1.position.set(3, 3, 3);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(new THREE.Color(color).offsetHSL(0.3, 0, 0), 0.8, 8);
    pointLight2.position.set(-3, -3, 2);
    scene.add(pointLight2);

    // Add to DOM
    mountRef.current.appendChild(renderer.domElement);

    // Mouse interaction
    const handleMouseMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      onHover?.(true);
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      onHover?.(false);
    };

    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('mouseenter', handleMouseEnter);
    renderer.domElement.addEventListener('mouseleave', handleMouseLeave);

    // Animation loop
    const animate = () => {
      timeRef.current += 0.016; // ~60fps
      
      if (cubeRef.current && outerCubeRef.current) {
        // Dynamic rotation based on mouse and scroll
        const mouseInfluence = isHoveredRef.current ? 2.0 : 1.0;
        const scrollInfluence = 1.0 + scrollProgress * 0.5;
        
        cubeRef.current.rotation.x += speed * mouseInfluence * scrollInfluence;
        cubeRef.current.rotation.y += speed * 1.2 * mouseInfluence;
        cubeRef.current.rotation.z += speed * 0.8;

        // Counter-rotate outer cube
        outerCubeRef.current.rotation.x -= speed * 0.5;
        outerCubeRef.current.rotation.y -= speed * 0.7;
        outerCubeRef.current.rotation.z += speed * 0.3;

        // Mouse interaction
        if (isHoveredRef.current) {
          cubeRef.current.rotation.y += mouseRef.current.x * 0.02;
          cubeRef.current.rotation.x += mouseRef.current.y * 0.02;
        }

        // Update shader uniforms
        if (cubeRef.current.material instanceof THREE.ShaderMaterial) {
          cubeRef.current.material.uniforms.time.value = timeRef.current;
          cubeRef.current.material.uniforms.intensity.value = intensity * (isHoveredRef.current ? 1.5 : 1.0);
        }
      }

      // Animate particles
      if (particleSystemRef.current) {
        const positions = particleSystemRef.current.geometry.attributes.position.array as Float32Array;
        const velocities = particleSystemRef.current.geometry.attributes.velocity.array as Float32Array;
        
        for (let i = 0; i < positions.length; i += 3) {
          // Apply velocities
          positions[i] += velocities[i];
          positions[i + 1] += velocities[i + 1];
          positions[i + 2] += velocities[i + 2];
          
          // Orbit around cube with some randomness
          const distance = Math.sqrt(positions[i]**2 + positions[i + 1]**2 + positions[i + 2]**2);
          if (distance > 5) {
            // Reset particle position
            const radius = 3 + Math.random();
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            positions[i] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i + 2] = radius * Math.cos(phi);
          }
        }
        
        particleSystemRef.current.geometry.attributes.position.needsUpdate = true;
        particleSystemRef.current.rotation.y += 0.002;
      }

      // Dynamic lighting
      pointLight1.intensity = 1 + Math.sin(timeRef.current * 2) * 0.3;
      pointLight2.intensity = 0.8 + Math.cos(timeRef.current * 1.5) * 0.2;

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
      
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('mouseenter', handleMouseEnter);
      renderer.domElement.removeEventListener('mouseleave', handleMouseLeave);
      
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      
      // Dispose Three.js objects
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [size, speed, color, variant, intensity, scrollProgress, shaderMaterials, onHover]);

  return (
    <div 
      ref={mountRef} 
      className={`enhanced-rotating-cube ${className}`}
      style={{
        width: size,
        height: size,
        display: 'inline-block',
        cursor: 'pointer',
        filter: isHoveredRef.current ? 'brightness(1.2)' : 'brightness(1)',
        transition: 'filter 0.3s ease',
        ...style
      }}
    />
  );
};

export default EnhancedRotatingCube;