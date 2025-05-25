import React from 'react';
import { Canvas } from '@react-three/fiber';

function Snake3Game() {
  console.log('Rendering Snake3Game with truly EMPTY Canvas');
  // Removed all other hooks, state, and wrapper divs for this test.
  // The only thing returned is the Canvas component itself.
  return <Canvas />;
}

export default Snake3Game;