import { useRef } from 'react';
import { Box, Grid } from '@react-three/drei';

/**
 * GridBoundary Component
 * 
 * Renders the 8×8×8 cube grid boundary for the Snake³ game.
 * Includes grid helpers for orientation and coordinate visualization.
 */
function GridBoundary({ size = 8 }) {
  const gridRef = useRef();
  
  console.log('GridBoundary props:', { size });

  return (
    <group>
      {/* Main grid boundary */}
      <Box 
        args={[size, size, size]} 
        position={[size/2 - 0.5, size/2 - 0.5, size/2 - 0.5]}
      >
        <meshBasicMaterial 
          color="#4080ff" 
          wireframe={true} 
          transparent={true} 
          opacity={0.3} 
        />
      </Box>
      
      {/* Grid axis indicators */}
      <Grid 
        args={[size, size]} 
        position={[size/2 - 0.5, 0, size/2 - 0.5]} 
        rotation={[0, 0, 0]} 
        cellColor="#404040"
        sectionColor="#808080"
        fadeDistance={size * 2}
        ref={gridRef}
      />
      
      <Grid 
        args={[size, size]} 
        position={[size/2 - 0.5, size/2 - 0.5, 0]} 
        rotation={[Math.PI/2, 0, 0]} 
        cellColor="#404040"
        sectionColor="#808080"
        fadeDistance={size * 2}
      />
      
      <Grid 
        args={[size, size]} 
        position={[0, size/2 - 0.5, size/2 - 0.5]} 
        rotation={[0, 0, Math.PI/2]} 
        cellColor="#404040"
        sectionColor="#808080"
        fadeDistance={size * 2}
      />
      
      {/* Coordinate indicators (simplified for initial implementation) */}
      <group>
        {/* X-axis label */}
        <mesh position={[size, 0, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshBasicMaterial color="#ff4040" />
        </mesh>
        
        {/* Y-axis label */}
        <mesh position={[0, size, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshBasicMaterial color="#40ff40" />
        </mesh>
        
        {/* Z-axis label */}
        <mesh position={[0, 0, size]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshBasicMaterial color="#4040ff" />
        </mesh>
      </group>
    </group>
  );
}

export default GridBoundary;