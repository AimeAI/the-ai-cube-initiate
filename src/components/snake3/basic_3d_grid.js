/**
 * Sacred Grid System for Snake³: The Axis Mind
 * 
 * Core utilities for managing the sacred geometric grid space where consciousness
 * navigates through multi-dimensional data structures within the mystical cube.
 * 
 * This system forms the foundation of the sacred chamber where initiates learn
 * to think in three dimensions while manipulating crystalline data structures.
 * 
 * @module GridUtils
 * @version 2.0.0
 * @author The Codekeepers
 */

import * as THREE from 'three';

/**
 * Sacred Grid Configuration - The Mystical Parameters
 * These constants define the dimensional boundaries of consciousness expansion
 */
export const SACRED_GRID_CONFIG = {
  // Core Dimensional Matrix - 8x8x8 for initiate training
  chamberSize: 8,                    // Sacred cube dimensions (8³ = 512 positions)
  unitSpacing: 1.0,                  // Distance between consciousness nodes
  centerPoint: [0, 0, 0],           // Origin of the dimensional axis
  
  // Sacred Geometry Constants
  goldenRatio: 1.618033988749895,    // φ - The divine proportion
  crystalRadius: 0.4,                // Base scale for sacred objects
  
  // Dimensional Boundaries for Consciousness Containment
  bounds: {
    min: -3.5,                       // Minimum coordinate boundary
    max: 3.5                         // Maximum coordinate boundary
  },
  
  // Mystical Visual Configuration
  aesthetics: {
    gridLineOpacity: 0.12,           // Subtle grid visibility
    boundaryOpacity: 0.25,           // Chamber wall visibility
    nodeEmission: 0.4,               // Sacred object glow intensity
    particleDensity: 0.3,            // Ambient energy density
    
    // Sacred Color Palette - The Axis Mind Theme
    colors: {
      axisX: '#00D4FF',              // Cyan - Consciousness dimension
      axisY: '#8B5FFF',              // Violet - Growth dimension  
      axisZ: '#FF6B35',              // Orange - Knowledge dimension
      voidBlack: '#0A0A0F',          // Deep space background
      nodeCore: '#FFD700',           // Golden data cores
      crystalWhite: '#F8F8FF',       // Pure light essence
      energyGlow: '#00FFFF'          // Mystical emanation
    }
  }
};

/**
 * Convert discrete grid coordinates to world space positions
 * Transforms sacred grid logic into 3D spatial reality
 * 
 * @param {number} x - Grid X coordinate (0 to chamberSize-1)
 * @param {number} y - Grid Y coordinate (0 to chamberSize-1) 
 * @param {number} z - Grid Z coordinate (0 to chamberSize-1)
 * @returns {[number, number, number]} World space coordinates
 */
export function gridToWorld(x, y, z) {
  const { chamberSize, unitSpacing } = SACRED_GRID_CONFIG;
  const offset = (chamberSize - 1) / 2;
  
  return [
    (x - offset) * unitSpacing,
    (y - offset) * unitSpacing,
    (z - offset) * unitSpacing
  ];
}

/**
 * Convert world space coordinates to discrete grid coordinates
 * Translates 3D spatial positions back to sacred grid logic
 * 
 * @param {number} x - World X coordinate
 * @param {number} y - World Y coordinate
 * @param {number} z - World Z coordinate
 * @returns {[number, number, number]} Grid coordinates
 */
export function worldToGrid(x, y, z) {
  const { chamberSize, unitSpacing } = SACRED_GRID_CONFIG;
  const offset = (chamberSize - 1) / 2;
  
  return [
    Math.round(x / unitSpacing + offset),
    Math.round(y / unitSpacing + offset),
    Math.round(z / unitSpacing + offset)
  ];
}

/**
 * Validate if grid coordinates exist within the sacred chamber bounds
 * Ensures consciousness remains within the dimensional container
 * 
 * @param {number} x - Grid X coordinate
 * @param {number} y - Grid Y coordinate
 * @param {number} z - Grid Z coordinate
 * @returns {boolean} True if position is within sacred bounds
 */
export function isValidGridPosition(x, y, z) {
  const { chamberSize } = SACRED_GRID_CONFIG;
  return x >= 0 && x < chamberSize &&
         y >= 0 && y < chamberSize &&
         z >= 0 && z < chamberSize;
}

/**
 * Generate mystically random valid grid position using sacred algorithms
 * Creates position using divine randomness for optimal data node manifestation
 * 
 * @returns {[number, number, number]} Random valid grid coordinates
 */
export function generateSacredPosition() {
  const { chamberSize } = SACRED_GRID_CONFIG;
  return [
    Math.floor(Math.random() * chamberSize),
    Math.floor(Math.random() * chamberSize),
    Math.floor(Math.random() * chamberSize)
  ];
}

/**
 * Calculate Manhattan distance between two consciousness positions
 * Measures dimensional separation using sacred geometry
 * 
 * @param {[number, number, number]} pos1 - First consciousness position
 * @param {[number, number, number]} pos2 - Second consciousness position
 * @returns {number} Manhattan distance in grid units
 */
export function getSacredDistance(pos1, pos2) {
  return Math.abs(pos1[0] - pos2[0]) + 
         Math.abs(pos1[1] - pos2[1]) + 
         Math.abs(pos1[2] - pos2[2]);
}

/**
 * Calculate Euclidean distance for mystical field effects
 * Determines energy field interaction ranges between sacred objects
 * 
 * @param {[number, number, number]} pos1 - First position
 * @param {[number, number, number]} pos2 - Second position
 * @returns {number} Euclidean distance
 */
export function getMysticalFieldDistance(pos1, pos2) {
  const dx = pos1[0] - pos2[0];
  const dy = pos1[1] - pos2[1];
  const dz = pos1[2] - pos2[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Get all neighboring positions for consciousness expansion
 * Returns adjacent positions for movement and interaction calculations
 * 
 * @param {[number, number, number]} position - Current consciousness position
 * @param {boolean} includeDiagonals - Include diagonal neighbors for advanced moves
 * @returns {Array<[number, number, number]>} Array of accessible neighbor positions
 */
export function getSacredNeighbors(position, includeDiagonals = false) {
  const [x, y, z] = position;
  const neighbors = [];
  
  // Six cardinal directions - primary consciousness movement vectors
  const cardinalDirections = [
    [1, 0, 0], [-1, 0, 0],    // X-axis (consciousness dimension)
    [0, 1, 0], [0, -1, 0],    // Y-axis (growth dimension)
    [0, 0, 1], [0, 0, -1]     // Z-axis (knowledge dimension)
  ];
  
  cardinalDirections.forEach(([dx, dy, dz]) => {
    const newPos = [x + dx, y + dy, z + dz];
    if (isValidGridPosition(...newPos)) {
      neighbors.push(newPos);
    }
  });
  
  if (includeDiagonals) {
    // Advanced consciousness movement - diagonal phase transitions
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dz = -1; dz <= 1; dz++) {
          if (dx === 0 && dy === 0 && dz === 0) continue; // Skip current position
          
          // Skip cardinal directions (already processed)
          const isCardinal = (Math.abs(dx) + Math.abs(dy) + Math.abs(dz)) === 1;
          if (isCardinal) continue;
          
          const newPos = [x + dx, y + dy, z + dz];
          if (isValidGridPosition(...newPos)) {
            neighbors.push(newPos);
          }
        }
      }
    }
  }
  
  return neighbors;
}

/**
 * Generate sacred spiral pattern for mystical data node placement
 * Creates positions following golden ratio and Fibonacci sequences
 * Used for advanced chamber configurations and consciousness challenges
 * 
 * @param {number} count - Number of positions to generate
 * @returns {Array<[number, number, number]>} Array of spiral-distributed positions
 */
export function generateGoldenSpiral(count) {
  const positions = [];
  const { chamberSize, goldenRatio } = SACRED_GRID_CONFIG;
  const center = Math.floor(chamberSize / 2);
  
  for (let i = 0; i < count; i++) {
    const angle = i * goldenRatio * Math.PI * 2;
    const radius = Math.sqrt(i) * 0.6;
    
    const x = Math.floor(center + radius * Math.cos(angle));
    const y = Math.floor(center + radius * Math.sin(angle));
    const z = Math.floor(center + (i % 3 - 1) * radius * 0.4);
    
    if (isValidGridPosition(x, y, z)) {
      positions.push([x, y, z]);
    }
  }
  
  return positions;
}

/**
 * Check if two consciousness positions are identical
 * Essential for collision detection and data collection
 * 
 * @param {[number, number, number]} pos1 - First position
 * @param {[number, number, number]} pos2 - Second position
 * @returns {boolean} True if positions occupy same dimensional space
 */
export function positionsEqual(pos1, pos2) {
  return pos1[0] === pos2[0] && 
         pos1[1] === pos2[1] && 
         pos1[2] === pos2[2];
}

/**
 * Convert position array to sacred key for efficient mystical lookups
 * Creates unique string identifier for dimensional position storage
 * 
 * @param {[number, number, number]} position - Grid position
 * @returns {string} Sacred string representation
 */
export function positionToSacredKey(position) {
  return `${position[0]},${position[1]},${position[2]}`;
}

/**
 * Convert sacred key back to position coordinates
 * Reverses the mystical encoding for dimensional calculations
 * 
 * @param {string} key - Sacred key from positionToSacredKey
 * @returns {[number, number, number]} Grid position coordinates
 */
export function sacredKeyToPosition(key) {
  return key.split(',').map(Number);
}

/**
 * Generate mystical chamber initialization pattern
 * Creates the starting configuration for consciousness training
 * 
 * @returns {Object} Complete chamber setup with snake and data positions
 */
export function generateInitiateChamber() {
  const { chamberSize } = SACRED_GRID_CONFIG;
  const center = Math.floor(chamberSize / 2);
  
  return {
    // Snake consciousness starts at chamber center, growing backwards
    snakeSegments: [
      [center, center, center],        // Head - primary consciousness
      [center - 1, center, center],    // Body segment 1
      [center - 2, center, center]     // Tail - trailing awareness
    ],
    
    // Initial direction: positive X (consciousness expansion)
    direction: [1, 0, 0],
    
    // First data node positioned for easy collection
    dataNodePosition: [center + 2, center, center],
    
    // Sacred chamber metrics
    metrics: {
      chamberSize,
      totalPositions: chamberSize ** 3,
      startingLength: 3,
      expansionDirection: 'consciousness'
    }
  };
}