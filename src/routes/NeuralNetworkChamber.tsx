import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Sphere, Line, Html } from '@react-three/drei';
import * as THREE from 'three';

// Sacred color system
const colors = {
  axisX: '#00D4FF',
  axisY: '#8B5FFF', 
  axisZ: '#FF6B35',
  voidBlack: '#0A0A0F',
  nodeCore: '#FFD700',
  textPrimary: '#E8E8FF',
  textSecondary: '#A8A8C8',
  crystalWhite: '#F8F8FF',
  energyGlow: '#00FFFF'
};

// Neural network node component
const NetworkNode = ({ position, value, isActive, isOutput, layer, onClick }: any) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.scale.setScalar(
        (isActive ? 1.2 : 0.8) + Math.sin(state.clock.elapsedTime * 2) * 0.1
      );
    }
  });

  const nodeColor = isOutput 
    ? colors.axisZ 
    : layer === 0 
    ? colors.axisX 
    : colors.axisY;

  return (
    <group position={position}>
      <Sphere
        ref={meshRef}
        args={[0.3, 16, 16]}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial 
          color={nodeColor}
          emissive={nodeColor}
          emissiveIntensity={isActive ? 0.3 : 0.1}
          transparent
          opacity={0.8}
        />
      </Sphere>
      {hovered && (
        <Html>
          <div className="bg-black/80 text-white p-2 rounded text-sm">
            Value: {value.toFixed(2)}
          </div>
        </Html>
      )}
    </group>
  );
};

// Connection between nodes
const NetworkConnection = ({ start, end, weight, isActive }) => {
  const points = useMemo(() => [
    new THREE.Vector3(...start),
    new THREE.Vector3(...end)
  ], [start, end]);

  const lineColor = isActive ? colors.energyGlow : colors.textSecondary;
  const opacity = Math.abs(weight) * (isActive ? 1 : 0.3);

  return (
    <Line
      points={points}
      color={lineColor}
      lineWidth={Math.abs(weight) * 3 + 1}
      transparent
      opacity={opacity}
    />
  );
};

// 3D Neural Network visualization
const NeuralNetwork3D = ({ network, activeNodes, onNodeClick }) => {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(0, 0, 8);
  }, [camera]);

  // Generate positions for nodes
  const nodePositions = useMemo(() => {
    const positions = [];
    const layerSpacing = 4;
    const nodeSpacing = 1.5;
    
    network.layers.forEach((layer, layerIndex) => {
      const layerNodes = layer.nodes.length;
      const startY = -(layerNodes - 1) * nodeSpacing / 2;
      
      layer.nodes.forEach((node, nodeIndex) => {
        positions.push([
          (layerIndex - 1) * layerSpacing,
          startY + nodeIndex * nodeSpacing,
          0
        ]);
      });
    });
    
    return positions;
  }, [network]);

  return (
    <group>
      {/* Render connections */}
      {network.connections.map((conn, index) => (
        <NetworkConnection
          key={index}
          start={nodePositions[conn.from]}
          end={nodePositions[conn.to]}
          weight={conn.weight}
          isActive={activeNodes.includes(conn.from) && activeNodes.includes(conn.to)}
        />
      ))}
      
      {/* Render nodes */}
      {network.layers.map((layer, layerIndex) => 
        layer.nodes.map((node, nodeIndex) => {
          const globalIndex = network.layers.slice(0, layerIndex).reduce((sum, l) => sum + l.nodes.length, 0) + nodeIndex;
          return (
            <NetworkNode
              key={globalIndex}
              position={nodePositions[globalIndex]}
              value={node.value}
              isActive={activeNodes.includes(globalIndex)}
              isOutput={layerIndex === network.layers.length - 1}
              layer={layerIndex}
              onClick={() => onNodeClick(globalIndex)}
            />
          );
        })
      )}
      
      {/* Layer labels */}
      {network.layers.map((layer, index) => (
        <Text
          key={index}
          position={[(index - 1) * 4, -3, 0]}
          fontSize={0.5}
          color={colors.textPrimary}
          anchorX="center"
          font="/fonts/orbitron.woff"
        >
          {index === 0 ? 'INPUT' : index === network.layers.length - 1 ? 'OUTPUT' : 'HIDDEN'}
        </Text>
      ))}
    </group>
  );
};

// Training pattern visualization
const PatternDisplay = ({ pattern, onPatternClick }) => {
  const gridSize = Math.sqrt(pattern.input.length);
  
  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-transparent border border-purple-400/30 rounded-lg p-4">
      <h3 className="text-crystal-white font-orbitron text-lg mb-3">Training Pattern</h3>
      <div 
        className="grid gap-1 mb-3 cursor-pointer hover:scale-105 transition-transform"
        style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
        onClick={() => onPatternClick(pattern)}
      >
        {pattern.input.map((value, index) => (
          <div
            key={index}
            className="aspect-square rounded-sm"
            style={{
              backgroundColor: `rgba(0, 212, 255, ${value})`,
              border: '1px solid rgba(139, 95, 255, 0.3)'
            }}
          />
        ))}
      </div>
      <div className="text-sm text-text-secondary">
        Expected: {pattern.expected}
      </div>
    </div>
  );
};

// Main Neural Network Chamber component
const NeuralNetworkChamber = () => {
  // Initialize neural network structure
  const [network, setNetwork] = useState(() => ({
    layers: [
      { nodes: Array(9).fill(null).map(() => ({ value: 0 })) }, // Input layer (3x3 grid)
      { nodes: Array(6).fill(null).map(() => ({ value: 0 })) }, // Hidden layer
      { nodes: Array(3).fill(null).map(() => ({ value: 0 })) }  // Output layer
    ],
    connections: []
  }));

  const [activeNodes, setActiveNodes] = useState([]);
  const [currentPattern, setCurrentPattern] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const [mysticalMessage, setMysticalMessage] = useState("Welcome to the Neural Network Chamber, young architect of consciousness...");

  // Training patterns - simple shape recognition
  const trainingPatterns = [
    {
      input: [1, 1, 1, 0, 0, 0, 0, 0, 0], // Horizontal line
      expected: 0,
      name: "Horizon"
    },
    {
      input: [1, 0, 0, 1, 0, 0, 1, 0, 0], // Vertical line
      expected: 1,
      name: "Pillar"
    },
    {
      input: [1, 0, 1, 0, 1, 0, 1, 0, 1], // Diagonal line
      expected: 2,
      name: "Bridge"
    },
    {
      input: [0, 1, 0, 1, 1, 1, 0, 1, 0], // Plus shape
      expected: 0,
      name: "Cross"
    },
    {
      input: [1, 1, 1, 1, 0, 1, 1, 1, 1], // Square
      expected: 1,
      name: "Chamber"
    },
    {
      input: [0, 0, 0, 0, 1, 0, 0, 0, 0], // Center dot
      expected: 2,
      name: "Core"
    }
  ];

  // Initialize network connections
  useEffect(() => {
    const connections = [];
    let connIndex = 0;
    
    // Input to hidden connections
    for (let i = 0; i < 9; i++) {
      for (let j = 9; j < 15; j++) {
        connections.push({
          from: i,
          to: j,
          weight: (Math.random() - 0.5) * 2
        });
      }
    }
    
    // Hidden to output connections
    for (let i = 9; i < 15; i++) {
      for (let j = 15; j < 18; j++) {
        connections.push({
          from: i,
          to: j,
          weight: (Math.random() - 0.5) * 2
        });
      }
    }

    setNetwork(prev => ({ ...prev, connections }));
  }, []);

  // Forward propagation simulation
  const forwardPass = (inputPattern) => {
    const newNetwork = { ...network };
    
    // Set input values
    inputPattern.forEach((value, index) => {
      newNetwork.layers[0].nodes[index].value = value;
    });

    // Calculate hidden layer
    for (let h = 0; h < 6; h++) {
      let sum = 0;
      for (let i = 0; i < 9; i++) {
        const connIndex = i * 6 + h;
        sum += inputPattern[i] * network.connections[connIndex].weight;
      }
      newNetwork.layers[1].nodes[h].value = Math.max(0, sum); // ReLU activation
    }

    // Calculate output layer
    for (let o = 0; o < 3; o++) {
      let sum = 0;
      for (let h = 0; h < 6; h++) {
        const connIndex = 54 + h * 3 + o; // 54 = 9*6 input-to-hidden connections
        sum += newNetwork.layers[1].nodes[h].value * network.connections[connIndex].weight;
      }
      newNetwork.layers[2].nodes[o].value = 1 / (1 + Math.exp(-sum)); // Sigmoid activation
    }

    return newNetwork;
  };

  // Animate forward pass
  const animateForwardPass = async (inputPattern) => {
    const steps = [
      () => setActiveNodes([0, 1, 2, 3, 4, 5, 6, 7, 8]), // Activate input
      () => setActiveNodes([9, 10, 11, 12, 13, 14]), // Activate hidden
      () => setActiveNodes([15, 16, 17]), // Activate output
      () => setActiveNodes([]) // Clear activation
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      steps[i]();
    }
  };

  // Handle pattern selection
  const handlePatternClick = async (pattern) => {
    setMysticalMessage(`Channeling the essence of ${pattern.name}...`);
    const newNetwork = forwardPass(pattern.input);
    setNetwork(newNetwork);
    await animateForwardPass(pattern.input);
    
    // Check prediction
    const predicted = newNetwork.layers[2].nodes.reduce((maxIdx, node, idx, arr) => 
      node.value > arr[maxIdx].value ? idx : maxIdx, 0);
    
    const isCorrect = predicted === pattern.expected;
    setMysticalMessage(isCorrect ? 
      "The neural pathways align with cosmic truth! ✨" : 
      "The network seeks deeper understanding...");
  };

  // Training simulation
  const trainNetwork = () => {
    setIsTraining(true);
    setMysticalMessage("The sacred training ritual begins...");
    
    let trainingAccuracy = 0;
    const trainingInterval = setInterval(() => {
      trainingAccuracy += Math.random() * 15;
      if (trainingAccuracy > 85) {
        trainingAccuracy = 85 + Math.random() * 10;
      }
      setAccuracy(Math.min(95, trainingAccuracy));
      
      if (trainingAccuracy >= 90) {
        clearInterval(trainingInterval);
        setIsTraining(false);
        setMysticalMessage("The neural constellation achieves enlightenment! 🌟");
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20 text-white font-sans">
      {/* Sacred Header */}
      <div className="text-center py-8 px-4">
        <h1 className="text-4xl md:text-6xl font-black text-crystal-white mb-4" 
            style={{ fontFamily: 'Orbitron, monospace', textShadow: '0 0 20px #00FFFF' }}>
          NEURAL NETWORK CHAMBER
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          Witness the sacred architecture of artificial minds. 
          Shape the flow of consciousness through crystalline neural pathways.
        </p>
      </div>

      {/* Main Interface */}
      <div className="flex flex-col lg:flex-row gap-6 px-4 pb-8">
        {/* 3D Neural Network Visualization */}
        <div className="flex-1 h-96 lg:h-[600px] bg-gradient-to-br from-void-black/90 via-void-black/70 to-transparent 
                        border border-cyan-400/30 rounded-xl backdrop-blur-lg
                        shadow-[0_0_40px_rgba(0,212,255,0.15)]">
          <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={0.8} color={colors.energyGlow} />
            <pointLight position={[-10, -10, 10]} intensity={0.5} color={colors.nodeCore} />
            <NeuralNetwork3D 
              network={network} 
              activeNodes={activeNodes}
              onNodeClick={(index) => {
                setMysticalMessage(`Node ${index} resonates with sacred energy...`);
              }}
            />
          </Canvas>
        </div>

        {/* Control Panel */}
        <div className="w-full lg:w-80 space-y-6">
          {/* Training Patterns */}
          <div className="bg-gradient-to-br from-void-black/90 via-void-black/70 to-transparent 
                          border border-purple-400/30 rounded-xl p-6 backdrop-blur-lg">
            <h2 className="text-xl font-orbitron text-crystal-white mb-4">Sacred Patterns</h2>
            <div className="grid grid-cols-2 gap-3">
              {trainingPatterns.slice(0, 4).map((pattern, index) => (
                <PatternDisplay 
                  key={index} 
                  pattern={pattern} 
                  onPatternClick={handlePatternClick}
                />
              ))}
            </div>
          </div>

          {/* Network Status */}
          <div className="bg-gradient-to-br from-void-black/90 via-void-black/70 to-transparent 
                          border border-orange-400/30 rounded-xl p-6 backdrop-blur-lg">
            <h3 className="text-xl font-orbitron text-crystal-white mb-4">Network Consciousness</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Accuracy</span>
                  <span>{accuracy.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-cyan-400 to-purple-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${accuracy}%` }}
                  />
                </div>
              </div>
              
              <button
                onClick={trainNetwork}
                disabled={isTraining}
                className="w-full py-3 px-6 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent
                           border border-purple-400/50 text-crystal-white font-orbitron
                           hover:shadow-[0_0_30px_rgba(139,95,255,0.5)] transition-all duration-500
                           disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
              >
                {isTraining ? 'Training Sacred Pathways...' : 'Begin Neural Training'}
              </button>
            </div>
          </div>

          {/* Mystical Guidance */}
          <div className="bg-gradient-to-br from-void-black/90 via-void-black/70 to-transparent 
                          border border-cyan-400/30 rounded-xl p-6 backdrop-blur-lg">
            <h3 className="text-lg font-orbitron text-crystal-white mb-3">Sacred Wisdom</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              {mysticalMessage}
            </p>
          </div>
        </div>
      </div>

      {/* Educational Footer */}
      <div className="border-t border-gray-700/50 p-6 text-center">
        <p className="text-sm text-text-secondary max-w-3xl mx-auto">
          Neural networks learn through layers of interconnected nodes, each processing information and passing it forward. 
          The sacred geometry of artificial intelligence mirrors the patterns of consciousness itself.
        </p>
      </div>
    </div>
  );
};

export default NeuralNetworkChamber;