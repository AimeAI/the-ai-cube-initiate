// src/components/snake3/DataNode.jsx
import React, { useRef, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../../store/gameStore';

/**
 * DataNodeParticles Component
 */
const DataNodeParticles = forwardRef((props, ref) => {
  const particleCount = 50;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    const radius = 0.5 + Math.random() * 0.3;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);

    colors[i3] = 0.2 + Math.random() * 0.2;
    colors[i3 + 1] = 0.8 + Math.random() * 0.2;
    colors[i3 + 2] = 0.8 + Math.random() * 0.2;
  }

  return (
    <Points ref={ref} {...props}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <PointMaterial
        size={0.05}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.8}
      />
    </Points>
  );
});

/**
 * DataNode Component
 */
function DataNode() {
  const nodeRef = useRef();
  const icosaRef = useRef();
  const particlesRef = useRef();

  const rawPosition = useGameStore((state) => state.dataNode?.position);
  const position = {
    x: rawPosition?.x ?? 0,
    y: rawPosition?.y ?? 0,
    z: rawPosition?.z ?? 0,
  };

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    if (nodeRef.current) {
      const scale = 1 + Math.sin(time * 2) * 0.1;
      nodeRef.current.scale.set(scale, scale, scale);
    }

    if (icosaRef.current) {
      icosaRef.current.rotation.x += delta * 0.5;
      icosaRef.current.rotation.y += delta * 0.3;
      icosaRef.current.rotation.z += delta * 0.2;
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={nodeRef} position={[position.x, position.y, position.z]}>
      <mesh ref={icosaRef}>
        <icosahedronGeometry args={[0.4, 1]} />
        <meshStandardMaterial
          color="#40ffff"
          emissive="#40ffff"
          emissiveIntensity={0.5}
          wireframe
        />
      </mesh>

      <Sphere args={[0.3, 16, 16]}>
        <meshStandardMaterial
          color="#40ffff"
          transparent
          opacity={0.3}
          emissive="#40ffff"
          emissiveIntensity={0.5}
        />
      </Sphere>

      <DataNodeParticles ref={particlesRef} />

      <pointLight
        color="#40ffff"
        intensity={1}
        distance={2}
        decay={2}
      />
    </group>
  );
}

export default DataNode;