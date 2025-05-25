import React, { useMemo } from 'react'; // Added useMemo for SafeParticles if we were to use it
import * as THREE from 'three';

interface DataNodeProps {
  position?: [number, number, number]; // Made position optional for SimpleDataNode
  count?: number; // Added for potential SafeParticles, though not used by SimpleDataNode
}

// Replace complex DataNode with basic version:
const SimpleDataNode: React.FC<DataNodeProps> = ({ position = [0, 0, 0] }) => (
  <mesh position={position}>
    <sphereGeometry args={[0.2, 8, 8]} />
    <meshBasicMaterial color="#40ffff" />
  </mesh>
);

// The user suggested SafeParticles, keeping it here for reference if SimpleDataNode isn't sufficient
// or if a particle-based DataNode is desired later.
// const SafeParticles = ({ count = 50 }) => {
//   const positions = useMemo(() => {
//     const arr = new Float32Array(count * 3);
//     for (let i = 0; i < count; i++) {
//       arr[i * 3] = (Math.random() - 0.5) * 2;
//       arr[i * 3 + 1] = (Math.random() - 0.5) * 2;
//       arr[i * 3 + 2] = (Math.random() - 0.5) * 2;
//     }
//     return arr;
//   }, [count]);

//   return (
//     <points>
//       <bufferGeometry>
//         <bufferAttribute
//           attach="attributes-position"
//           count={count}
//           array={positions}
//           itemSize={3}
//         />
//       </bufferGeometry>
//       <pointsMaterial size={0.05} color="#40ffff" />
//     </points>
//   );
// };

// Using SimpleDataNode as the primary export as per immediate fix instructions
const DataNode: React.FC<DataNodeProps> = ({ position }) => {
  return <SimpleDataNode position={position} />;
};

export default DataNode;