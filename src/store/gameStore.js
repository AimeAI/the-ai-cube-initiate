import { create } from 'zustand';

/**
 * Game State Store
 * 
 * Central state management for the Snake³ game using Zustand.
 * Manages snake position, movement, game state, and scoring.
 */
const useGameStore = create((set, get) => ({
  // Game state
  isPaused: false,
  isGameOver: false,
  isVictory: false,
  victoryType: null,
  score: 0,
  nodesCollected: 0,
  elapsedTime: 0,
  gameSpeed: 5, // Moves per second
  lastTimestamp: null,
  moveAccumulator: 0,
  lastDirection: null, // For tracking direction changes
  
  // Grid configuration
  gridSize: 8,
  
  // Snake state
  snake: {
    segments: [{ x: 4, y: 4, z: 4 }], // Start with just the head at center
    direction: { x: 1, y: 0, z: 0 }, // Start moving right
    nextDirection: null, // For queuing direction changes
    growthPending: 0,
    visibleSegmentCount: 3, // Number of visible segments
  },
  
  // Data node state
  dataNode: {
    position: { x: 6, y: 4, z: 4 }, // Initial position
    value: 10, // Points awarded for collection
  },
  
  // Initialize game
  initializeGame: () => {
    set({
      isPaused: false,
      isGameOver: false,
      isVictory: false,
      victoryType: null,
      score: 0,
      nodesCollected: 0,
      elapsedTime: 0,
      lastTimestamp: null,
      moveAccumulator: 0,
      lastDirection: { x: 1, y: 0, z: 0 },
      
      snake: {
        segments: [{ x: 4, y: 4, z: 4 }],
        direction: { x: 1, y: 0, z: 0 },
        nextDirection: null,
        growthPending: 0,
        visibleSegmentCount: 3,
      },
      
      dataNode: {
        position: { x: 6, y: 4, z: 4 },
        value: 10,
      },
    });
    
    // Spawn first data node in a valid position
    get().spawnDataNode();
  },
  
  // Reset game
  resetGame: () => {
    get().initializeGame();
  },
  
  // Toggle pause state
  togglePause: () => {
    set(state => ({ isPaused: !state.isPaused }));
  },
  
  // Update game state (called by game loop)
  updateGame: (deltaTime) => {
    const state = get();
    
    // Skip update if game is paused or over
    if (state.isPaused || state.isGameOver || state.isVictory) {
      return;
    }
    
    // Update elapsed time
    set(state => ({ 
      elapsedTime: state.elapsedTime + deltaTime / 1000 
    }));
    
    // Check if it's time to move the snake
    set(state => ({ 
      moveAccumulator: state.moveAccumulator + deltaTime 
    }));
    
    if (get().moveAccumulator >= 1000 / get().gameSpeed) {
      set({ moveAccumulator: 0 });
      
      // Store current direction for change detection
      set(state => ({ 
        lastDirection: { ...state.snake.direction } 
      }));
      
      // Apply pending direction change
      if (get().snake.nextDirection) {
        set(state => ({
          snake: {
            ...state.snake,
            direction: state.snake.nextDirection,
            nextDirection: null,
          }
        }));
      }
      
      // Move snake
      get().moveSnake();
      
      // Check for collisions
      get().checkCollisions();
      
      // Check win conditions
      get().checkWinConditions();
    }
  },
  
  // Move snake
  moveSnake: () => {
    const { snake } = get();
    const head = snake.segments[0];
    
    // Calculate new head position
    const newHead = {
      x: head.x + snake.direction.x,
      y: head.y + snake.direction.y,
      z: head.z + snake.direction.z,
    };
    
    // Create new segments array with new head at front
    const newSegments = [newHead, ...snake.segments];
    
    // Remove tail segment if no growth is pending
    if (snake.growthPending > 0) {
      set(state => ({
        snake: {
          ...state.snake,
          segments: newSegments,
          growthPending: state.snake.growthPending - 1,
        }
      }));
    } else {
      // Remove last segment
      newSegments.pop();
      
      set(state => ({
        snake: {
          ...state.snake,
          segments: newSegments,
        }
      }));
    }
  },
  
  // Change snake direction
  changeDirection: (newDirection) => {
    const { snake } = get();
    
    // Prevent 180° turns
    if (
      (newDirection.x !== 0 && newDirection.x === -snake.direction.x) ||
      (newDirection.y !== 0 && newDirection.y === -snake.direction.y) ||
      (newDirection.z !== 0 && newDirection.z === -snake.direction.z)
    ) {
      return;
    }
    
    // Queue direction change
    set(state => ({
      snake: {
        ...state.snake,
        nextDirection: newDirection,
      }
    }));
  },
  
  // Check for collisions
  checkCollisions: () => {
    const { snake, gridSize } = get();
    const head = snake.segments[0];
    
    // Check boundary collision
    if (
      head.x < 0 || head.x >= gridSize ||
      head.y < 0 || head.y >= gridSize ||
      head.z < 0 || head.z >= gridSize
    ) {
      get().handleCollision("boundary");
      return;
    }
    
    // Check self collision (skip head)
    for (let i = 1; i < snake.segments.length; i++) {
      const segment = snake.segments[i];
      if (
        head.x === segment.x &&
        head.y === segment.y &&
        head.z === segment.z
      ) {
        get().handleCollision("self");
        return;
      }
    }
    
    // Check data node collection
    const { dataNode } = get();
    if (
      head.x === dataNode.position.x &&
      head.y === dataNode.position.y &&
      head.z === dataNode.position.z
    ) {
      get().collectDataNode();
    }
  },
  
  // Handle collision
  handleCollision: (type) => {
    set({ isGameOver: true });
    // Voice guidance will be handled by the VoiceGuidance component
  },
  
  // Collect data node
  collectDataNode: () => {
    const { dataNode } = get();
    
    // Increase score
    set(state => ({ 
      score: state.score + dataNode.value,
      nodesCollected: state.nodesCollected + 1,
    }));
    
    // Grow snake
    set(state => ({
      snake: {
        ...state.snake,
        growthPending: state.snake.growthPending + 1,
      }
    }));
    
    // Spawn new data node
    get().spawnDataNode();
  },
  
  // Spawn data node in a valid position
  spawnDataNode: () => {
    const { snake, gridSize } = get();
    const occupiedPositions = new Set();
    
    // Mark all snake segments as occupied
    snake.segments.forEach(segment => {
      const key = `${segment.x},${segment.y},${segment.z}`;
      occupiedPositions.add(key);
    });
    
    // Find available positions
    const availablePositions = [];
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        for (let z = 0; z < gridSize; z++) {
          const key = `${x},${y},${z}`;
          if (!occupiedPositions.has(key)) {
            availablePositions.push({ x, y, z });
          }
        }
      }
    }
    
    // Select random available position
    if (availablePositions.length > 0) {
      const randomIndex = Math.floor(Math.random() * availablePositions.length);
      const position = availablePositions[randomIndex];
      
      set(state => ({
        dataNode: {
          ...state.dataNode,
          position,
        }
      }));
    }
  },
  
  // Check win conditions
  checkWinConditions: () => {
    const { nodesCollected, elapsedTime } = get();
    
    // Check collection win condition (10 nodes)
    if (nodesCollected >= 10) {
      set({ 
        isVictory: true,
        victoryType: "collection"
      });
      return;
    }
    
    // Check survival win condition (60 seconds)
    if (elapsedTime >= 60) {
      set({ 
        isVictory: true,
        victoryType: "survival"
      });
      return;
    }
  },
  
  // Update game speed
  updateGameSpeed: (speed) => {
    set({ gameSpeed: speed });
  },
}));

export { useGameStore };