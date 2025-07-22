// Comprehensive game configuration system
export interface GameConfig {
  id: string;
  title: string;
  description: string;
  path: string;
  category: 'beginner' | 'intermediate' | 'advanced';
  ageGroups: {
    young: AgeGroupConfig;    // 6-8 years
    middle: AgeGroupConfig;   // 9-12 years
    teen: AgeGroupConfig;     // 13-16 years
  };
  aiConcepts: string[];
  skills: string[];
  estimatedDuration: number; // minutes
  isEnhanced: boolean;
  isGuestAccessible: boolean;
  difficulty: 1 | 2 | 3 | 4 | 5;
  prerequisites?: string[];
  achievements: Achievement[];
  educationalObjectives: string[];
  parentGuidance: string;
}

export interface AgeGroupConfig {
  title: string;
  description: string;
  metaphor: string;
  keyLearning: string[];
  visualStyle: 'playful' | 'balanced' | 'technical';
  interactionComplexity: 'simple' | 'medium' | 'complex';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  concept?: string;
}

// Comprehensive games configuration
export const gamesConfig: GameConfig[] = [
  {
    id: 'snake-3',
    title: 'Snake³',
    description: 'Learn programming fundamentals through 3D snake navigation',
    path: '/games/snake-3',
    category: 'beginner',
    ageGroups: {
      young: {
        title: 'Magic Snake Adventure',
        description: 'Help the friendly snake collect magical orbs!',
        metaphor: 'Teaching a pet snake where to go',
        keyLearning: ['Following instructions', 'Planning ahead', 'Problem solving'],
        visualStyle: 'playful',
        interactionComplexity: 'simple'
      },
      middle: {
        title: 'Programming Snake',
        description: 'Control a snake using programming concepts!',
        metaphor: 'Writing code to control a computer program',
        keyLearning: ['Sequential instructions', 'Loops', 'Conditional logic'],
        visualStyle: 'balanced',
        interactionComplexity: 'medium'
      },
      teen: {
        title: 'Algorithm Visualization',
        description: 'Explore pathfinding and game AI algorithms',
        metaphor: 'Implementing game AI and pathfinding algorithms',
        keyLearning: ['Algorithm design', 'State management', 'Optimization'],
        visualStyle: 'technical',
        interactionComplexity: 'complex'
      }
    },
    aiConcepts: ['Sequential Processing', 'State Management', 'Pathfinding'],
    skills: ['Logic', 'Planning', 'Problem Solving'],
    estimatedDuration: 15,
    isEnhanced: true,
    isGuestAccessible: true,
    difficulty: 2,
    achievements: [
      {
        id: 'first-move',
        title: 'First Steps!',
        description: 'Made your first move in the game',
        icon: '🚀',
        rarity: 'common',
        points: 10,
        concept: 'Sequential Instructions: Computers follow commands one after another'
      },
      {
        id: 'data-collector',
        title: 'Data Collector!',
        description: 'Collected your first data node',
        icon: '📊',
        rarity: 'common',
        points: 25,
        concept: 'Data Collection: AI systems gather information to make decisions'
      }
    ],
    educationalObjectives: [
      'Understand sequential instruction execution',
      'Learn basic algorithmic thinking',
      'Practice problem-solving and planning'
    ],
    parentGuidance: 'This game teaches fundamental programming concepts through play. Encourage your child to think ahead and plan their moves.'
  },
  {
    id: 'crystal-resonance',
    title: 'Crystal Resonance',
    description: 'Master pattern recognition through musical sequences',
    path: '/games/crystal-resonance',
    category: 'beginner',
    ageGroups: {
      young: {
        title: 'Musical Memory Friends',
        description: 'Help magical crystals sing their beautiful songs!',
        metaphor: 'Playing Simon Says with musical friends',
        keyLearning: ['Memory skills', 'Pattern recognition', 'Listening carefully'],
        visualStyle: 'playful',
        interactionComplexity: 'simple'
      },
      middle: {
        title: 'Pattern Recognition Lab',
        description: 'Learn how computers recognize and remember patterns!',
        metaphor: 'Training a computer to recognize musical patterns',
        keyLearning: ['Pattern matching', 'Sequence memory', 'Signal processing'],
        visualStyle: 'balanced',
        interactionComplexity: 'medium'
      },
      teen: {
        title: 'Signal Processing Engine',
        description: 'Explore audio pattern recognition and sequence analysis',
        metaphor: 'Implementing pattern recognition algorithms',
        keyLearning: ['Signal processing', 'Pattern algorithms', 'Sequence analysis'],
        visualStyle: 'technical',
        interactionComplexity: 'complex'
      }
    },
    aiConcepts: ['Pattern Recognition', 'Sequence Processing', 'Memory Systems'],
    skills: ['Memory', 'Pattern Recognition', 'Attention'],
    estimatedDuration: 12,
    isEnhanced: true,
    isGuestAccessible: true,
    difficulty: 1,
    achievements: [
      {
        id: 'first-harmony',
        title: 'Harmony Creator!',
        description: 'Created your first crystal harmony',
        icon: '🎵',
        rarity: 'common',
        points: 20,
        concept: 'Pattern Recognition: AI identifies and reproduces patterns in data'
      }
    ],
    educationalObjectives: [
      'Develop pattern recognition skills',
      'Understand sequence processing',
      'Learn about memory in AI systems'
    ],
    parentGuidance: 'This game develops memory and pattern recognition skills essential for understanding how AI processes information.'
  },
  {
    id: 'neural-network-chamber',
    title: 'Neural Network Chamber',
    description: 'Build and train artificial neural networks',
    path: '/games/neural-network-chamber',
    category: 'intermediate',
    ageGroups: {
      young: {
        title: 'Robot Brain Builder',
        description: 'Build a thinking brain for robots using colorful blocks!',
        metaphor: 'Building with LEGO blocks to make a robot brain',
        keyLearning: ['Connecting parts', 'How brains work', 'Making decisions'],
        visualStyle: 'playful',
        interactionComplexity: 'simple'
      },
      middle: {
        title: 'AI Brain Architect',
        description: 'Design neural networks that can learn and think!',
        metaphor: 'Engineering a thinking machine with connected parts',
        keyLearning: ['Neural connections', 'Learning systems', 'AI architecture'],
        visualStyle: 'balanced',
        interactionComplexity: 'medium'
      },
      teen: {
        title: 'Deep Learning Engineer',
        description: 'Implement and train deep neural networks',
        metaphor: 'Programming artificial intelligence systems',
        keyLearning: ['Neural architecture', 'Backpropagation', 'Deep learning'],
        visualStyle: 'technical',
        interactionComplexity: 'complex'
      }
    },
    aiConcepts: ['Neural Networks', 'Machine Learning', 'Deep Learning'],
    skills: ['Systems Thinking', 'Architecture Design', 'Logical Reasoning'],
    estimatedDuration: 20,
    isEnhanced: true,
    isGuestAccessible: true,
    difficulty: 3,
    achievements: [
      {
        id: 'neural-pioneer',
        title: 'Neural Pioneer!',
        description: 'Built your first neural network',
        icon: '🧠',
        rarity: 'rare',
        points: 50,
        concept: 'Neural Networks: AI learns by connecting simple processing units'
      }
    ],
    educationalObjectives: [
      'Understand neural network architecture',
      'Learn about machine learning fundamentals',
      'Explore how AI systems process information'
    ],
    parentGuidance: 'This game introduces core AI concepts. Help your child understand that AI learns by connecting simple parts into complex systems.'
  },
  {
    id: 'quantum-chamber',
    title: 'Quantum Chamber',
    description: 'Explore quantum computing concepts through interactive puzzles',
    path: '/games/quantum-chamber',
    category: 'advanced',
    ageGroups: {
      young: {
        title: 'Magic Teleportation Cubes',
        description: 'Play with magical cubes that can be in two places at once!',
        metaphor: 'Playing with magic blocks that have special powers',
        keyLearning: ['Magic rules', 'Special abilities', 'Puzzle solving'],
        visualStyle: 'playful',
        interactionComplexity: 'simple'
      },
      middle: {
        title: 'Superposition Explorer',
        description: 'Discover how quantum computers work differently!',
        metaphor: 'Exploring computers that work with quantum magic',
        keyLearning: ['Quantum states', 'Superposition', 'Quantum gates'],
        visualStyle: 'balanced',
        interactionComplexity: 'medium'
      },
      teen: {
        title: 'Quantum Computing Lab',
        description: 'Program quantum algorithms and explore quantum mechanics',
        metaphor: 'Engineering quantum computational systems',
        keyLearning: ['Quantum mechanics', 'Quantum algorithms', 'Quantum advantage'],
        visualStyle: 'technical',
        interactionComplexity: 'complex'
      }
    },
    aiConcepts: ['Quantum Computing', 'Superposition', 'Quantum Algorithms'],
    skills: ['Abstract Thinking', 'Quantum Logic', 'Advanced Problem Solving'],
    estimatedDuration: 25,
    isEnhanced: false,
    isGuestAccessible: false,
    difficulty: 5,
    prerequisites: ['neural-network-chamber'],
    achievements: [
      {
        id: 'quantum-master',
        title: 'Quantum Master!',
        description: 'Mastered quantum superposition',
        icon: '⚛️',
        rarity: 'legendary',
        points: 100,
        concept: 'Quantum Computing: Uses quantum mechanics for exponentially faster computation'
      }
    ],
    educationalObjectives: [
      'Introduce quantum computing concepts',
      'Understand superposition and entanglement',
      'Explore quantum advantage in computation'
    ],
    parentGuidance: 'Quantum concepts are advanced. Focus on the wonder and possibilities rather than technical details.'
  },
  {
    id: 'reinforcement-lab',
    title: 'Reinforcement Lab',
    description: 'Watch AI agents learn through trial and error',
    path: '/games/reinforcement-lab',
    category: 'intermediate',
    ageGroups: {
      young: {
        title: 'Learning Pet Robot',
        description: 'Watch a robot pet learn tricks through practice!',
        metaphor: 'Training a pet to find treats by trying different paths',
        keyLearning: ['Learning from mistakes', 'Getting better with practice', 'Rewards and consequences'],
        visualStyle: 'playful',
        interactionComplexity: 'simple'
      },
      middle: {
        title: 'AI Training Ground',
        description: 'Train AI agents to solve problems through experience!',
        metaphor: 'Teaching a computer to learn from trial and error',
        keyLearning: ['Reinforcement learning', 'Reward systems', 'Learning algorithms'],
        visualStyle: 'balanced',
        interactionComplexity: 'medium'
      },
      teen: {
        title: 'RL Algorithm Lab',
        description: 'Implement reinforcement learning algorithms',
        metaphor: 'Programming adaptive learning systems',
        keyLearning: ['Q-learning', 'Policy optimization', 'Exploration vs exploitation'],
        visualStyle: 'technical',
        interactionComplexity: 'complex'
      }
    },
    aiConcepts: ['Reinforcement Learning', 'Trial and Error Learning', 'Reward Systems'],
    skills: ['Patience', 'Observation', 'Understanding Cause and Effect'],
    estimatedDuration: 18,
    isEnhanced: false,
    isGuestAccessible: false,
    difficulty: 3,
    achievements: [
      {
        id: 'trainer',
        title: 'AI Trainer!',
        description: 'Successfully trained an AI agent',
        icon: '🎯',
        rarity: 'rare',
        points: 60,
        concept: 'Reinforcement Learning: AI learns optimal behavior through rewards and penalties'
      }
    ],
    educationalObjectives: [
      'Understand how AI learns from experience',
      'Learn about reward-based learning',
      'Explore trial-and-error problem solving'
    ],
    parentGuidance: 'This game shows how AI can learn and improve over time, just like humans do through practice.'
  },
  {
    id: 'decision-tree',
    title: 'Decision Tree Game',
    description: 'Learn how AI makes decisions through branching logic',
    path: '/games/decision-tree',
    category: 'intermediate',
    ageGroups: {
      young: {
        title: 'Choose Your Adventure',
        description: 'Help characters make good choices in fun stories!',
        metaphor: 'Following a map with different paths to reach your destination',
        keyLearning: ['Making choices', 'Following rules', 'Cause and effect'],
        visualStyle: 'playful',
        interactionComplexity: 'simple'
      },
      middle: {
        title: 'Smart Decision Maker',
        description: 'Build decision trees that help computers choose wisely!',
        metaphor: 'Creating a flowchart that helps make smart decisions',
        keyLearning: ['Decision logic', 'If-then rules', 'Classification'],
        visualStyle: 'balanced',
        interactionComplexity: 'medium'
      },
      teen: {
        title: 'ML Classification System',
        description: 'Implement decision tree algorithms for data classification',
        metaphor: 'Programming intelligent decision-making systems',
        keyLearning: ['Decision trees', 'Classification algorithms', 'Feature selection'],
        visualStyle: 'technical',
        interactionComplexity: 'complex'
      }
    },
    aiConcepts: ['Decision Trees', 'Classification', 'Logical Reasoning'],
    skills: ['Logical Thinking', 'Decision Making', 'Pattern Analysis'],
    estimatedDuration: 16,
    isEnhanced: false,
    isGuestAccessible: false,
    difficulty: 2,
    achievements: [
      {
        id: 'decision-master',
        title: 'Decision Master!',
        description: 'Built a perfect decision tree',
        icon: '🌳',
        rarity: 'rare',
        points: 45,
        concept: 'Decision Trees: AI uses branching logic to classify and make decisions'
      }
    ],
    educationalObjectives: [
      'Understand logical decision making',
      'Learn about classification systems',
      'Explore how AI processes choices'
    ],
    parentGuidance: 'This game teaches logical thinking and how computers can be programmed to make smart decisions.'
  },
  {
    id: 'vision-system',
    title: 'Vision System Challenge',
    description: 'Teach AI to see and recognize objects',
    path: '/games/vision-system',
    category: 'advanced',
    ageGroups: {
      young: {
        title: 'Shape Detective',
        description: 'Help the computer learn to see shapes and colors!',
        metaphor: 'Teaching a robot friend to recognize toys and objects',
        keyLearning: ['Recognizing shapes', 'Identifying colors', 'Finding patterns'],
        visualStyle: 'playful',
        interactionComplexity: 'simple'
      },
      middle: {
        title: 'Computer Vision Lab',
        description: 'Train AI systems to understand images and videos!',
        metaphor: 'Programming a computer to see and understand pictures',
        keyLearning: ['Image processing', 'Object recognition', 'Computer vision'],
        visualStyle: 'balanced',
        interactionComplexity: 'medium'
      },
      teen: {
        title: 'CV Algorithm Engineer',
        description: 'Implement computer vision and image recognition systems',
        metaphor: 'Developing advanced visual AI systems',
        keyLearning: ['Convolutional networks', 'Image classification', 'Object detection'],
        visualStyle: 'technical',
        interactionComplexity: 'complex'
      }
    },
    aiConcepts: ['Computer Vision', 'Image Recognition', 'Pattern Detection'],
    skills: ['Visual Analysis', 'Pattern Recognition', 'Attention to Detail'],
    estimatedDuration: 22,
    isEnhanced: false,
    isGuestAccessible: false,
    difficulty: 4,
    prerequisites: ['neural-network-chamber'],
    achievements: [
      {
        id: 'vision-expert',
        title: 'Vision Expert!',
        description: 'Mastered computer vision challenges',
        icon: '👁️',
        rarity: 'epic',
        points: 80,
        concept: 'Computer Vision: AI learns to interpret and understand visual information'
      }
    ],
    educationalObjectives: [
      'Understand how computers process images',
      'Learn about pattern recognition in visual data',
      'Explore real-world AI vision applications'
    ],
    parentGuidance: 'This game shows how AI can be taught to see and understand the world, like in self-driving cars and medical imaging.'
  }
];

// Helper functions
export const getGameById = (id: string): GameConfig | undefined => {
  return gamesConfig.find(game => game.id === id);
};

export const getGamesByCategory = (category: 'beginner' | 'intermediate' | 'advanced'): GameConfig[] => {
  return gamesConfig.filter(game => game.category === category);
};

export const getGuestAccessibleGames = (): GameConfig[] => {
  return gamesConfig.filter(game => game.isGuestAccessible);
};

export const getEnhancedGames = (): GameConfig[] => {
  return gamesConfig.filter(game => game.isEnhanced);
};

export const getGamesByDifficulty = (maxDifficulty: number): GameConfig[] => {
  return gamesConfig.filter(game => game.difficulty <= maxDifficulty);
};

export const getAgeAppropriateDescription = (game: GameConfig, age: number): AgeGroupConfig => {
  if (age <= 8) return game.ageGroups.young;
  if (age <= 12) return game.ageGroups.middle;
  return game.ageGroups.teen;
};

export const getRecommendedGames = (age: number, completedGames: string[] = []): GameConfig[] => {
  const maxDifficulty = age <= 8 ? 2 : age <= 12 ? 3 : 5;
  const availableGames = getGamesByDifficulty(maxDifficulty);
  
  return availableGames.filter(game => {
    // Don't recommend completed games
    if (completedGames.includes(game.id)) return false;
    
    // Check prerequisites
    if (game.prerequisites) {
      return game.prerequisites.every(prereq => completedGames.includes(prereq));
    }
    
    return true;
  }).sort((a, b) => a.difficulty - b.difficulty);
};
