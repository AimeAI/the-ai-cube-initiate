import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/gameStore';

/**
 * Snake Component for Snake³: The Axis Mind
 * 
 * Renders the player-controlled snake in 3D space using instanced meshes for performance.
 * Features:
 * - Movement along X, Y, Z axes
 * - Keyboard controls (WASD + Q/E)
 * - Fading tail segments (invisible after 3 steps)
 * - Collision detection with boundaries and self
 */
function Snake() {
  // Reference to the instanced mesh
  const meshRef = useRef();
  
  // Get snake data and game state from Zustand store
  const segments = useGameStore(state => state.snake.segments);
  const direction = useGameStore(state => state.snake.direction);
  const changeDirection = useGameStore(state => state.changeDirection);
  const isPaused = useGameStore(state => state.isPaused);
  const isGameOver = useGameStore(state => state.isGameOver);
  
  // Create temporary object for matrix calculations
  const tempObject = useMemo(() => new THREE.Object3D(), []);
  
  // Create materials for head and body segments
  const headMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#ffff40",
    transparent: true,
    opacity: 1.0,
    emissive: "#ffff40",
    emissiveIntensity: 0.3
  }), []);
  
  const bodyMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#40ff40",
    transparent: true,
    opacity: 0.7
  }), []);

  // Handle keyboard input for snake movement
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isPaused || isGameOver) return;
      
      // Direction vectors for each key
      const directions = {
        'w': { x: 0, y: 1, z: 0 },  // Forward (+Y)
        's': { x: 0, y: -1, z: 0 }, // Backward (-Y)
        'a': { x: -1, y: 0, z: 0 }, // Left (-X)
        'd': { x: 1, y: 0, z: 0 },  // Right (+X)
        'q': { x: 0, y: 0, z: 1 },  // Deeper (+Z)
        'e': { x: 0, y: 0, z: -1 }  // Shallower (-Z)
      };
      
      // Get direction based on key pressed
      const key = e.key.toLowerCase();
      if (directions[key]) {
        changeDirection(directions[key]);
      }
    };
    
    // Add event listener for keyboard controls
    window.addEventListener('keydown', handleKeyDown);
    
    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [changeDirection, isPaused, isGameOver]);
  
  // Update snake rendering on each frame
  useFrame(() => {
    if (!meshRef.current || segments.length === 0) return;
    
    // Calculate visible segment count (all segments are tracked for collision,
    // but only a subset are visible)
    const visibleSegmentCount = Math.min(segments.length, 3);
    
    // Update each segment's position, scale, and opacity
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      
      // Position the segment
      tempObject.position.set(segment.x, segment.y, segment.z);
      
      // Scale (head is larger than body segments)
      const scale = i === 0 ? 0.9 : 0.7 - (i * 0.02);
      tempObject.scale.set(scale, scale, scale);
      
      // Update matrix
      tempObject.updateMatrix();
      
      // Only set matrix for visible segments
      if (i < visibleSegmentCount) {
        meshRef.current.setMatrixAt(i, tempObject.matrix);
        
        // Update material opacity based on position in snake
        // Segments fade out as they get further from the head
        const opacity = Math.max(0.3, 1 - (i / 3) * 0.7);
        
        if (i === 0) {
          headMaterial.opacity = opacity;
        } else {
          bodyMaterial.opacity = opacity;
        }
      }
    }
    
    // Update instance matrices
    meshRef.current.instanceMatrix.needsUpdate = true;
    
    // Apply appropriate material to head
    if (segments.length > 0) {
      meshRef.current.setColorAt(0, new THREE.Color("#ffff40"));
    }
  });
  
  // Calculate the maximum possible number of segments
  // This is used to initialize the instanced mesh
  const maxSegments = 20; // Reasonable upper limit for performance

  console.log('Snake props/state:', { segmentsLength: segments.length, isPaused, isGameOver });
  
  return (
    <group>
      {/* Render snake segments as instanced meshes */}
      <instancedMesh 
        ref={meshRef}
        args={[null, null, maxSegments]}
        material={bodyMaterial}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[0.5, 16, 16]} />
      </instancedMesh>
      
      {/* Render head with eyes (only if we have segments) */}
      {segments.length > 0 && (
        <group position={[segments[0].x, segments[0].y, segments[0].z]}>
          {/* Eyes - these are separate meshes for visual detail */}
          <mesh position={[0.25, 0.2, 0.3]} scale={0.3}>
            <sphereGeometry args={[0.5, 8, 8]} />
            <meshBasicMaterial color="black" />
          </mesh>
          <mesh position={[-0.25, 0.2, 0.3]} scale={0.3}>
            <sphereGeometry args={[0.5, 8, 8]} />
            <meshBasicMaterial color="black" />
          </mesh>
        </group>
      )}
    </group>
  );
}

export default Snake;