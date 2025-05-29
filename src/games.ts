export interface Game {
  id: string;
  title: string;
  description: string;
  path: string;
  previewImage?: string; // Optional: for placeholder or actual image
}

export const games: Game[] = [
  {
    id: 'snake3',
    title: 'Snake³',
    description: 'Navigate the cybernetic serpent through data nodes.',
    path: '/games/snake-3', // Updated path
    previewImage: '/placeholder.svg', // Example placeholder
  },
  {
    id: 'crystal-resonance',
    title: 'Crystal Resonance',
    description: 'Harmonize crystal frequencies to unlock ancient powers.',
    path: '/games/crystal-resonance', // Updated path
    previewImage: '/placeholder.svg',
  },
  {
    id: 'neural-forge',
    title: 'Neural Forge',
    description: 'Craft and train neural networks in a high-stakes simulation.',
    path: '/games/neural-forge', // Updated path
    previewImage: '/placeholder.svg',
  },
  {
    id: 'classifier-construct',
    title: 'Classifier Construct',
    description: 'Build and test data classifiers in a competitive arena.',
    path: '/games/classifier-construct', // Updated path
    previewImage: '/placeholder.svg',
  },
  {
    id: 'decision-tree-mastery',
    title: 'Decision Tree Mastery',
    description: 'Master the art of decision tree algorithms.',
    path: '/games/decision-tree', // Updated path
    previewImage: '/placeholder.svg',
  },
  {
    id: 'ethics-framework',
    title: 'Ethics Framework',
    description: 'Navigate complex ethical dilemmas in AI development.',
    path: '/ethics-framework', // Updated path
    previewImage: '/placeholder.svg',
  },
  {
    id: 'generative-core',
    title: 'Generative Core',
    description: 'Explore the frontiers of generative AI models.',
    path: '/generative-core', // Updated path
    previewImage: '/placeholder.svg',
  },
  {
    id: 'neural-network-chamber',
    title: 'Neural Network Chamber',
    description: 'Experiment with neural architectures in a virtual lab.',
    path: '/games/neural-network-chamber', // Updated path
    previewImage: '/placeholder.svg',
  },
  {
    id: 'neural-pathways',
    title: 'Neural Pathways',
    description: 'Chart new courses for AI understanding.',
    path: '/games/neural-pathways', // Updated path
    previewImage: '/placeholder.svg',
  },
  {
    id: 'predictor-engine',
    title: 'Predictor Engine',
    description: 'Build and test predictive models against real-world data.',
    path: '/games/predictor-engine', // Updated path
    previewImage: '/placeholder.svg',
  },
  {
    id: 'quantum-chamber',
    title: 'Quantum Chamber',
    description: 'Explore the mysteries of quantum computing.',
    path: '/games/quantum-chamber', // Updated path
    previewImage: '/placeholder.svg',
  },
  {
    id: 'reinforcement-lab',
    title: 'Reinforcement Lab',
    description: 'Train agents using reinforcement learning techniques.',
    path: '/games/reinforcement-lab', // Updated path
    previewImage: '/placeholder.svg',
  },
  {
    id: 'trajectory-master',
    title: 'Trajectory Master',
    description: 'Calculate and predict object trajectories in dynamic environments.',
    path: '/games/trajectory', // Updated path
    previewImage: '/placeholder.svg',
  },
  {
    id: 'vision-system-challenge',
    title: 'Vision System Challenge',
    description: 'Develop and test advanced computer vision systems.',
    path: '/games/vision-system', // Updated path
    previewImage: '/placeholder.svg',
  },
  // Add more games as needed
];