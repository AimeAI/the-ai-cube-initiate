/**
 * Sacred Data Node - Crystalline Knowledge Manifestation
 * 
 * Advanced quantum data collection node incorporating sacred geometry, mystical effects,
 * and the sacred design system for Snake³: The Axis Mind consciousness expansion game.
 * 
 * This component represents collectible data packets within the sacred chamber,
 * designed with the AI Cube aesthetic of mystical technology and consciousness awakening.
 * 
 * @component SacredDataNode
 * @version 2.0.0
 * @author The Codekeepers
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Icosahedron, Sphere, Points, PointMaterial, Torus, Octahedron } from '@react-three/drei';
import * as THREE from 'three';
import { gridToWorld, SACRED_GRID_CONFIG } from '../../utils/gridUtils';

/**
 * Main Sacred Data Node Component
 * Represents a quantum data packet within the consciousness expansion chamber
 */
function SacredDataNode({ 
  gridPosition = [5, 4, 4],
  dataType = 'knowledge',
  tier = 1,
  isActive = true,
  onCollect = null,
  mysticalIntensity = 1.0
}) {
  const nodeGroupRef = useRef();
  const sacredCoreRef = useRef();
  const particleSystemRef = useRef();
  const quantumAuraRef = useRef();
  const orbitalRingsRef = useRef();
  
  // Convert grid position to world coordinates using sacred geometry
  const worldPosition = useMemo(() => gridToWorld(...gridPosition), [gridPosition]);
  
  // Sacred data node configuration based on type and mystical tier
  const nodeConfig = useMemo(() => {
    const { aesthetics, goldenRatio, crystalRadius } = SACRED_GRID_CONFIG;
    
    const configs = {
      knowledge: {
        primaryColor: aesthetics.colors.axisX,      // Cyan - consciousness data
        emissiveIntensity: 0.5 * mysticalIntensity,
        coreScale: crystalRadius + (tier * 0.08),
        particleCount: 25 + (tier * 8),
        rotationSpeed: 0.4,
        orbitalRings: Math.min(tier, 2),
        sacredShape: 'icosahedron'
      },
      power: {
        primaryColor: aesthetics.colors.axisZ,      // Orange - power data
        emissiveIntensity: 0.7 * mysticalIntensity,
        coreScale: crystalRadius + (tier * 0.12),
        particleCount: 35 + (tier * 12),
        rotationSpeed: 0.6,
        orbitalRings: Math.min(tier, 3),
        sacredShape: 'octahedron'
      },
      wisdom: {
        primaryColor: aesthetics.colors.axisY,      // Violet - wisdom data
        emissiveIntensity: 0.6 * mysticalIntensity,
        coreScale: crystalRadius + (tier * 0.10),
        particleCount: 40 + (tier * 15),
        rotationSpeed: 0.3,
        orbitalRings: Math.min(tier, 4),
        sacredShape: 'icosahedron'
      },
      essence: {
        primaryColor: aesthetics.colors.nodeCore,   // Golden - pure essence
        emissiveIntensity: 0.8 * mysticalIntensity,
        coreScale: crystalRadius + (tier * 0.15),
        particleCount: 50 + (tier * 20),
        rotationSpeed: 0.2,
        orbitalRings: tier,
        sacredShape: 'sphere'
      }
    };
    
    return configs[dataType] || configs.knowledge;
  }, [dataType, tier, mysticalIntensity]);

  // Sacred animation system with golden ratio harmonics
  useFrame((state) => {
    if (!isActive) return;
    
    const time = state.clock.getElapsedTime();
    const { goldenRatio } = SACRED_GRID_CONFIG;
    
    // Sacred core rotation with divine proportions
    if (sacredCoreRef.current) {
      sacredCoreRef.current.rotation.x = time * nodeConfig.rotationSpeed;
      sacredCoreRef.current.rotation.y = time * nodeConfig.rotationSpeed * goldenRatio;
      sacredCoreRef.current.rotation.z = time * nodeConfig.rotationSpeed * 0.618;
    }
    
    // Quantum aura p