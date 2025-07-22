import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface RotatingCubeProps {
  size?: number;
  speed?: number;
  color?: string;
  wireframe?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const RotatingCube: React.FC<RotatingCubeProps> = ({
  size = 100,
  speed = 0.01,
  color = '#00D4FF',
  wireframe = false,
  className = '',
  style = {}
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cubeRef = useRef<THREE.Mesh>();
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      1, // Square aspect ratio
      0.1,
      1000
    );
    camera.position.z = 3;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Transparent background
    rendererRef.current = renderer;

    // Cube geometry and material
    const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    
    let material: THREE.Material;
    if (wireframe) {
      material = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: true,
        transparent: true,
        opacity: 0.8
      });
    } else {
      material = new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.7,
        roughness: 0.3,
        transparent: true,
        opacity: 0.9
      });
    }

    const cube = new THREE.Mesh(geometry, material);
    cubeRef.current = cube;
    scene.add(cube);

    // Lighting for non-wireframe cubes
    if (!wireframe) {
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

      const pointLight = new THREE.PointLight(color, 0.5, 10);
      pointLight.position.set(-5, -5, 5);
      scene.add(pointLight);
    }

    // Add to DOM
    mountRef.current.appendChild(renderer.domElement);

    // Animation loop
    const animate = () => {
      if (cubeRef.current) {
        cubeRef.current.rotation.x += speed;
        cubeRef.current.rotation.y += speed * 1.2;
        cubeRef.current.rotation.z += speed * 0.8;
      }

      if (rendererRef.current && sceneRef.current) {
        rendererRef.current.render(sceneRef.current, camera);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (rendererRef.current) {
        rendererRef.current.setSize(size, size);
      }
    };

    window.addEventListener('resize', handleResize);

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
      if (cubeRef.current) {
        cubeRef.current.geometry.dispose();
        if (Array.isArray(cubeRef.current.material)) {
          cubeRef.current.material.forEach(material => material.dispose());
        } else {
          cubeRef.current.material.dispose();
        }
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [size, speed, color, wireframe]);

  return (
    <div 
      ref={mountRef} 
      className={`rotating-cube ${className}`}
      style={{
        width: size,
        height: size,
        display: 'inline-block',
        ...style
      }}
    />
  );
};

export default RotatingCube;