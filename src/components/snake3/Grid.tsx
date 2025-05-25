import React from 'react';
import { Box } from '@react-three/drei';

const Grid = (): JSX.Element => {
  // Placeholder for the 8x8x8 grid
  // For now, just rendering a single box to represent the grid area
  // Actual grid lines and cells will be implemented later.
  return (
    <Box args={[8, 8, 8]} position={[3.5, 3.5, 3.5]}>
      <meshStandardMaterial wireframe color="gray" />
    </Box>
  );
};

export default Grid;