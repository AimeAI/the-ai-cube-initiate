export interface Game {
  id: string;
  name: string;
  path: string;
  type: 'react' | 'iframe';
  thumbnail?: string; // Optional: path to a thumbnail image
  description?: string; // Optional: short description of the game
}

export const games: Game[] = [
  {
    id: 'classifier-construct',
    name: 'Classifier Construct',
    path: '/games/classifier-construct',
    type: 'react',
    description: 'A game about building and testing classifiers.',
  },
  {
    id: 'crystal-resonance',
    name: 'Crystal Resonance',
    path: '/games/crystal-resonance',
    type: 'react',
    description: 'Explore the world of crystal resonance.',
  },
  {
    id: 'decision-tree-game',
    name: 'Decision Tree Game',
    path: '/games/decision-tree',
    type: 'react',
    description: 'Navigate through a decision tree to solve puzzles.',
  },
  {
    id: 'neural-forge',
    name: 'Neural Forge',
    path: '/games/neural-forge',
    type: 'react',
    description: 'Forge neural networks in this interactive game.',
  },
  {
    id: 'neural-network-chamber',
    name: 'Neural Network Chamber',
    path: '/games/neural-network-chamber',
    type: 'react',
    description: 'Experiment with neural networks in a dedicated chamber.',
  },
  {
    id: 'neural-pathways',
    name: 'Neural Pathways',
    path: '/games/neural-pathways',
    type: 'react',
    description: 'Discover and map neural pathways.',
  },
  {
    id: 'predictor-engine-game',
    name: 'Predictor Engine',
    path: '/games/predictor-engine',
    type: 'react', // This component will wrap the iframe
    description: 'Test your prediction skills with the Predictor Engine.',
  },
  {
    id: 'quantum-chamber-game',
    name: 'Quantum Chamber',
    path: '/games/quantum-chamber',
    type: 'react', // Assuming a React wrapper for quantum-chamber/index.html
    description: 'Step into the Quantum Chamber.',
  },
  {
    id: 'reinforcement-lab',
    name: 'Reinforcement Lab',
    path: '/games/reinforcement-lab',
    type: 'react',
    description: 'Learn about reinforcement learning in this lab.',
  },
  {
    id: 'snake-3',
    name: 'Snake 3.0',
    path: '/games/snake-3',
    type: 'react',
    description: 'A modern take on the classic Snake game.',
  },
  {
    id: 'trajectory-game',
    name: 'Trajectory Game',
    path: '/games/trajectory',
    type: 'react', // This component will wrap the iframe
    description: 'Calculate and predict trajectories.',
  },
  {
    id: 'vision-system',
    name: 'Vision System',
    path: '/games/vision-system',
    type: 'react',
    description: 'Explore the mechanics of a vision system.',
  },
  // HTML/iframe based games - these paths will be handled by their respective React wrapper components
  // {
  //   id: 'predictor-engine-html',
  //   name: 'Predictor Engine (HTML)',
  //   path: '/games/predictor-engine/index.html', // Direct path for iframe if not wrapped
  //   type: 'iframe',
  //   description: 'Test your prediction skills with the Predictor Engine.',
  // },
  // {
  //   id: 'trajectory-game-html',
  //   name: 'Trajectory Game (HTML)',
  //   path: '/games/trajectory-game/index.html', // Direct path for iframe if not wrapped
  //   type: 'iframe',
  //   description: 'Calculate and predict trajectories.',
  // },
];