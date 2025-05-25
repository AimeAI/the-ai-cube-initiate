// src/components/snake3/SacredGeometry.jsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Icosahedron, Dodecahedron, Octahedron, Ring } from '@react-three/drei';

/**
 * SacredGeometry Component
 */
function SacredGeometry() {
  const groupRef = useRef();

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
      groupRef.current.rotation.z += delta * 0.02;
    }
  });

  console.log('SacredGeometry rendering');

  return (
    <group ref={groupRef} position={[4, 4, 4]}>
      <Icosahedron args={[15, 1]}>
        <meshBasicMaterial
          color="#ff4080"
          transparent
          opacity={0.1}
          wireframe
        />
      </Icosahedron>

      <Dodecahedron args={[12, 0]}>
        <meshBasicMaterial
          color="#40ff80"
          transparent
          opacity={0.1}
          wireframe
        />
      </Dodecahedron>

      <Octahedron args={[10, 0]}>
        <meshBasicMaterial
          color="#4080ff"
          transparent
          opacity={0.1}
          wireframe
        />
      </Octahedron>

      <FlowerOfLife />
    </group>
  );
}

function FlowerOfLife() {
  const radius = 1.5;
  const centerPositions = Array.from({ length: 7 }).map((_, i) => {
    const angle = (i * Math.PI * 2) / 6;
    return [
      radius * Math.cos(angle),
      radius * Math.sin(angle),
      0
    ];
  });
  centerPositions[0] = [0, 0, 0];

  return (
    <group position={[0, 0, -20]} rotation={[Math.PI / 2, 0, 0]}>
      {centerPositions.map(([x, y, z], i) => (
        <Ring
          key={i}
          args={[radius * 0.95, radius, 32]}
          position={[x, y, z]}
        >
          <meshBasicMaterial color="#4080ff" transparent opacity={0.2} side={2} />
        </Ring>
      ))}
    </group>
  );
}

export default SacredGeometry;