/**
 * Sacred Chamber Boundary - The Dimensional Container
 * 
 * Renders the mystical boundaries and grid visualization for Snake³: The Axis Mind
 * Creates the sacred chamber where consciousness learns to navigate 3D space
 * while manipulating crystalline data structures.
 * 
 * Incorporates the sacred design system with proper color palette, golden ratio
 * proportions, and mystical aesthetic elements matching The AI Cube architecture.
 * 
 * @component SacredChamberBoundary  
 * @version 2.0.0
 * @author The Codekeepers
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, Box } from '@react-three/drei';
import * as THREE from 'three';
import { SACRED_GRID_CONFIG } from '../../utils/gridUtils';

/**
 * Main Sacred Chamber Boundary Component
 * Creates the visual framework for the 3D consciousness expansion space
 */
function SacredChamberBoundary() {
  const boundaryRef = useRef();
  const gridSystemRef = useRef();
  const mysticFieldRef = useRef();
  
  // Sacred animation system with golden ratio timing
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const { goldenRatio } = SACRED_GRID_CONFIG;
    
    // Boundary breathing effect - subtle sacred geometry pulsing
    if (boundaryRef.current) {
      const pulse = 1 + Math.sin(time * 0.4) * 0.015; // Gentle breath of the chamber
      boundaryRef.current.scale.setScalar(pulse);
    }
    
    // Grid system rotation for dimensional awareness
    if (gridSystemRef.current) {
      gridSystemRef.current.rotation.y = time * 0.03; // Slow mystical rotation
      gridSystemRef.current.rotation.x = Math.sin(time * 0.2) * 0.05; // Subtle tilting
    }
    
    // Mystic field energy fluctuation
    if (mysticFieldRef.current) {
      mysticFieldRef.current.material.opacity = 0.1 + Math.sin(time * goldenRatio) * 0.05;
    }
  });

  return (
    <group name="sacred-chamber-boundary-system">
      {/* Primary Chamber Container */}
      <group ref={boundaryRef}>
        <ChamberBoundaryWalls />
      </group>
      
      {/* Sacred Grid Line System */}
      <group ref={gridSystemRef}>
        <SacredGridSystem />
      </group>
      
      {/* Dimensional Axis Indicators */}
      <DimensionalAxisSystem />
      
      {/* Mystic Energy Field */}
      <MysticEnergyField ref={mysticFieldRef} />
      
      {/* Golden Ratio Markers */}
      <GoldenRatioMarkers />
    </group>
  );
}

/**
 * Chamber Boundary Walls - The Sacred Container
 * Creates the primary wireframe boundaries with AI Cube aesthetics
 */
function ChamberBoundaryWalls() {
  const { chamberSize, unitSpacing, aesthetics } = SACRED_GRID_CONFIG;
  const boundarySize = chamberSize * unitSpacing;

  return (
    <group name="chamber-walls">
      {/* Primary boundary wireframe */}
      <mesh>
        <boxGeometry args={[boundarySize, boundarySize, boundarySize]} />
        <meshBasicMaterial 
          color={aesthetics.colors.energyGlow}
          wireframe={true}
          transparent={true}
          opacity={aesthetics.boundaryOpacity}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Secondary boundary with mystical glow */}
      <mesh>
        <boxGeometry args={[
          boundarySize + 0.2, 
          boundarySize + 0.2, 
          boundarySize + 0.2
        ]} />
        <meshBasicMaterial 
          color={aesthetics.colors.axisX}
          wireframe={true}
          transparent={true}
          opacity={aesthetics.boundaryOpacity * 0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/**
 * Sacred Grid System - Consciousness Navigation Lines
 * Creates the mystical grid pattern for spatial awareness and movement guidance
 */
function SacredGridSystem() {
  const { chamberSize, unitSpacing, aesthetics } = SACRED_GRID_CONFIG;
  const halfSize = (chamberSize - 1) * unitSpacing / 2;
  
  const gridLines = useMemo(() => {
    const lines = [];
    
    // Generate sacred grid lines for each dimensional plane
    for (let i = 0; i < chamberSize; i++) {
      const pos = (i * unitSpacing) - halfSize;
      
      // X-Consciousness Plane Lines (Z = 0) - Cyan tinted
      lines.push({
        key: `consciousness-x-${i}`,
        points: [
          new THREE.Vector3(pos, -halfSize, 0),
          new THREE.Vector3(pos, halfSize, 0)
        ],
        color: aesthetics.colors.axisX,
        opacity: aesthetics.gridLineOpacity * 1.2
      });
      
      lines.push({
        key: `consciousness-y-${i}`,
        points: [
          new THREE.Vector3(-halfSize, pos, 0),
          new THREE.Vector3(halfSize, pos, 0)
        ],
        color: aesthetics.colors.axisX,
        opacity: aesthetics.gridLineOpacity * 1.2
      });
      
      // Y-Growth Plane Lines (X = 0) - Violet tinted
      lines.push({
        key: `growth-y-${i}`,
        points: [
          new THREE.Vector3(0, pos, -halfSize),
          new THREE.Vector3(0, pos, halfSize)
        ],
        color: aesthetics.colors.axisY,
        opacity: aesthetics.gridLineOpacity
      });
      
      lines.push({
        key: `growth-z-${i}`,
        points: [
          new THREE.Vector3(0, -halfSize, pos),
          new THREE.Vector3(0, halfSize, pos)
        ],
        color: aesthetics.colors.axisY,
        opacity: aesthetics.gridLineOpacity
      });
      
      // Z-Knowledge Plane Lines (Y = 0) - Orange tinted
      lines.push({
        key: `knowledge-x-${i}`,
        points: [
          new THREE.Vector3(pos, 0, -halfSize),
          new THREE.Vector3(pos, 0, halfSize)
        ],
        color: aesthetics.colors.axisZ,
        opacity: aesthetics.gridLineOpacity * 0.8
      });
      
      lines.push({
        key: `knowledge-z-${i}`,
        points: [
          new THREE.Vector3(-halfSize, 0, pos),
          new THREE.Vector3(halfSize, 0, pos)
        ],
        color: aesthetics.colors.axisZ,
        opacity: aesthetics.gridLineOpacity * 0.8
      });
    }
    
    return lines;
  }, [chamberSize, unitSpacing, halfSize, aesthetics]);

  return (
    <group name="sacred-grid-lines">
      {gridLines.map(({ key, points, color, opacity }) => (
        <Line
          key={key}
          points={points}
          color={color}
          transparent
          opacity={opacity}
          lineWidth={1}
        />
      ))}
    </group>
  );
}

/**
 * Dimensional Axis System - The Sacred Coordinate Framework
 * Renders the three primary axes with mystical color coding
 */
function DimensionalAxisSystem() {
  const { chamberSize, unitSpacing, aesthetics } = SACRED_GRID_CONFIG;
  const axisLength = (chamberSize * unitSpacing) / 2 + 1;
  
  const sacredAxes = useMemo(() => [
    {
      name: 'consciousness-axis',
      points: [
        new THREE.Vector3(-axisLength, 0, 0),
        new THREE.Vector3(axisLength, 0, 0)
      ],
      color: aesthetics.colors.axisX,
      intensity: 0.8
    },
    {
      name: 'growth-axis',
      points: [
        new THREE.Vector3(0, -axisLength, 0),
        new THREE.Vector3(0, axisLength, 0)
      ],
      color: aesthetics.colors.axisY,
      intensity: 0.7
    },
    {
      name: 'knowledge-axis',
      points: [
        new THREE.Vector3(0, 0, -axisLength),
        new THREE.Vector3(0, 0, axisLength)
      ],
      color: aesthetics.colors.axisZ,
      intensity: 0.6
    }
  ], [axisLength, aesthetics]);

  return (
    <group name="dimensional-axis-system">
      {sacredAxes.map(({ name, points, color, intensity }) => (
        <Line
          key={name}
          points={points}
          color={color}
          transparent
          opacity={intensity}
          lineWidth={2}
        />
      ))}
      
      {/* Origin marker - The consciousness center point */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshBasicMaterial 
          color={aesthetics.colors.crystalWhite}
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  );
}

/**
 * Mystic Energy Field - Ambient chamber atmosphere
 * Creates the subtle energy field that permeates the sacred space
 */
const MysticEnergyField = React.forwardRef((props, ref) => {
  const { chamberSize, unitSpacing, aesthetics } = SACRED_GRID_CONFIG;
  const fieldSize = chamberSize * unitSpacing * 1.2;
  
  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <sphereGeometry args={[fieldSize, 16, 16]} />
      <meshBasicMaterial 
        color={aesthetics.colors.energyGlow}
        transparent
        opacity={0.05}
        side={THREE.BackSide}
      />
    </mesh>
  );
});

/**
 * Golden Ratio Markers - Sacred geometry indicators
 * Places mystical markers at golden ratio positions for advanced training
 */
function GoldenRatioMarkers() {
  const { chamberSize, unitSpacing, goldenRatio, aesthetics } = SACRED_GRID_CONFIG;
  const halfSize = (chamberSize - 1) * unitSpacing / 2;
  
  const goldenPositions = useMemo(() => {
    const positions = [];
    const goldenDistance = halfSize / goldenRatio;
    
    // Golden ratio markers on each dimensional axis
    const markers = [
      [goldenDistance, 0, 0],           // Positive consciousness
      [-goldenDistance, 0, 0],          // Negative consciousness
      [0, goldenDistance, 0],           // Positive growth
      [0, -goldenDistance, 0],          // Negative growth
      [0, 0, goldenDistance],           // Positive knowledge
      [0, 0, -goldenDistance]           // Negative knowledge
    ];
    
    return markers;
  }, [halfSize, goldenRatio]);

  return (
    <group name="golden-ratio-markers">
      {goldenPositions.map((position, index) => (
        <group key={index} position={position}>
          {/* Sacred octahedron marker */}
          <mesh>
            <octahedronGeometry args={[0.06, 0]} />
            <meshBasicMaterial 
              color={aesthetics.colors.nodeCore}
              transparent
              opacity={0.5}
            />
          </mesh>
          
          {/* Mystical glow effect */}
          <mesh>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshBasicMaterial 
              color={aesthetics.colors.nodeCore}
              transparent
              opacity={0.1}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * Grid Intersection Nodes - Enhanced spatial awareness points
 * Optional component for advanced training modes
 */
function SacredIntersectionNodes() {
  const { chamberSize, unitSpacing, aesthetics } = SACRED_GRID_CONFIG;
  const halfSize = (chamberSize - 1) * unitSpacing / 2;
  
  const intersectionNodes = useMemo(() => {
    const nodes = [];
    
    // Create intersection points at every grid position
    for (let x = 0; x < chamberSize; x++) {
      for (let y = 0; y < chamberSize; y++) {
        for (let z = 0; z < chamberSize; z++) {
          const worldPos = [
            (x * unitSpacing) - halfSize,
            (y * unitSpacing) - halfSize,
            (z * unitSpacing) - halfSize
          ];
          nodes.push(worldPos);
        }
      }
    }
    
    return nodes;
  }, [chamberSize, unitSpacing, halfSize]);

  return (
    <group name="sacred-intersection-nodes">
      {intersectionNodes.map((position, index) => (
        <mesh key={index} position={position}>
          <sphereGeometry args={[0.015, 6, 6]} />
          <meshBasicMaterial 
            color={aesthetics.colors.energyGlow}
            transparent
            opacity={0.08}
          />
        </mesh>
      ))}
    </group>
  );
}

export default SacredChamberBoundary;