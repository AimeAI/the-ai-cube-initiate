// src/routes/NeuralForge.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';

interface Node {
  x: number;
  y: number;
  activation: number;
  pulsePhase: number;
}

interface Layer {
  id: number;
  type: 'input' | 'hidden' | 'attention' | 'output';
  x: number;
  y: number;
  nodeCount: number;
  learningRate: number;
  activation: number;
  nodes: Node[];
  pulsePhase: number;
}

interface Connection {
  from: number;
  to: number;
  strength: number;
  pulsePhase: number;
}

const NeuralForge: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [layers, setLayers] = useState<Layer[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedLayerType, setSelectedLayerType] = useState<Layer['type']>('input');
  const [nodeCount, setNodeCount] = useState(8);
  const [learningRate, setLearningRate] = useState(0.01);
  const [activationStrength, setActivationStrength] = useState(0.5);
  const [mysticalMessage, setMysticalMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  const mysticalMessages = [
    "The neural pathways shimmer with consciousness...",
    "Each connection births new understanding...",
    "Sacred geometry guides the flow of information...",
    "Your network awakens to deeper patterns...",
    "The architecture of mind takes shape...",
    "Witness the emergence of artificial consciousness...",
    "Neural harmonies resonate through the network...",
    "Complexity births from sacred simplicity...",
    "The network learns, grows, transcends..."
  ];

  const showMysticalMessage = useCallback((message: string) => {
    setMysticalMessage(message);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 4000);
  }, []);

  const getRandomMysticalMessage = useCallback(() => {
    return mysticalMessages[Math.floor(Math.random() * mysticalMessages.length)];
  }, [mysticalMessages]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const container = canvas.parentElement;
    if (container) {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    }
  }, []);

  const createNodesForLayer = useCallback((layer: Omit<Layer, 'nodes'>): Node[] => {
    const radius = 60;
    const angleStep = (Math.PI * 2) / layer.nodeCount;
    const nodes: Node[] = [];

    for (let i = 0; i < layer.nodeCount; i++) {
      const angle = i * angleStep;
      const nodeX = layer.x + Math.cos(angle) * radius;
      const nodeY = layer.y + Math.sin(angle) * radius;

      nodes.push({
        x: nodeX,
        y: nodeY,
        activation: Math.random(),
        pulsePhase: Math.random() * Math.PI * 2
      });
    }

    return nodes;
  }, []);

  const createConnection = useCallback((fromLayerId: number, toLayerId: number): Connection => {
    return {
      from: fromLayerId,
      to: toLayerId,
      strength: Math.random() * 0.8 + 0.2,
      pulsePhase: Math.random() * Math.PI * 2
    };
  }, []);

  const getLayerColor = useCallback((type: Layer['type']): string => {
    switch (type) {
      case 'input': return '#00FFFF';
      case 'hidden': return 'var(--neonMint)'; // Using theme color
      case 'attention': return 'var(--electricCyan)'; // Using theme color
      case 'output': return '#32CD32'; // Keeping green for output, or could use another theme color
      default: return '#FFD700';
    }
  }, []);

  const addLayer = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const layerData = {
      id: Date.now(),
      type: selectedLayerType,
      x,
      y,
      nodeCount,
      learningRate,
      activation: activationStrength,
      pulsePhase: Math.random() * Math.PI * 2
    };

    const nodes = createNodesForLayer(layerData);
    const newLayer: Layer = { ...layerData, nodes };

    setLayers(prevLayers => {
      const updatedLayers = [...prevLayers, newLayer];
      
      // Auto-connect to previous layer if exists
      if (updatedLayers.length > 1) {
        const prevLayer = updatedLayers[updatedLayers.length - 2];
        const newConnection = createConnection(prevLayer.id, newLayer.id);
        setConnections(prevConnections => [...prevConnections, newConnection]);
      }
      
      return updatedLayers;
    });

    showMysticalMessage(getRandomMysticalMessage());
  }, [selectedLayerType, nodeCount, learningRate, activationStrength, createNodesForLayer, createConnection, showMysticalMessage, getRandomMysticalMessage]);

  const drawConnections = useCallback((ctx: CanvasRenderingContext2D, time: number) => {
    connections.forEach(conn => {
      const fromLayer = layers.find(l => l.id === conn.from);
      const toLayer = layers.find(l => l.id === conn.to);

      if (!fromLayer || !toLayer) return;

      fromLayer.nodes.forEach(fromNode => {
        toLayer.nodes.forEach(toNode => {
          const pulse = Math.sin(time + conn.pulsePhase) * 0.5 + 0.5;
          const alpha = Math.floor((conn.strength * pulse) * 255).toString(16).padStart(2, '0');

          ctx.beginPath();
          ctx.moveTo(fromNode.x, fromNode.y);
          ctx.lineTo(toNode.x, toNode.y);
          ctx.strokeStyle = '#FFD700' + alpha;
          ctx.lineWidth = conn.strength * 2;
          ctx.stroke();
        });
      });
    });
  }, [connections, layers]);

  const drawLayer = useCallback((ctx: CanvasRenderingContext2D, layer: Layer, time: number) => {
    const color = getLayerColor(layer.type);
    const pulse = Math.sin(time + layer.pulsePhase) * 0.3 + 0.7;

    // Draw central core
    ctx.beginPath();
    ctx.arc(layer.x, layer.y, 15 * pulse, 0, Math.PI * 2);
    ctx.fillStyle = color + '80';
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw nodes
    layer.nodes.forEach(node => {
      const nodePulse = Math.sin(time + node.pulsePhase) * 0.2 + 0.8;

      ctx.beginPath();
      ctx.arc(node.x, node.y, 8 * nodePulse, 0, Math.PI * 2);
      ctx.fillStyle = color + Math.floor(node.activation * 255).toString(16).padStart(2, '0');
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw activation glow
      if (node.activation > 0.7) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 15 * nodePulse, 0, Math.PI * 2);
        ctx.fillStyle = color + '20';
        ctx.fill();
      }
    });

    // Draw layer label
    ctx.fillStyle = color;
    ctx.font = '12px Orbitron, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(layer.type.toUpperCase(), layer.x, layer.y - 85);

    // Draw node count
    ctx.fillStyle = '#888';
    ctx.font = '10px Orbitron, monospace';
    ctx.fillText(`${layer.nodeCount} neurons`, layer.x, layer.y + 90);
  }, [getLayerColor]);

  const drawSacredGeometry = useCallback((ctx: CanvasRenderingContext2D, time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    ctx.strokeStyle = 'rgba(255, 215, 0, 0.1)';
    ctx.lineWidth = 1;

    for (let i = 0; i < 3; i++) {
      const radius = 200 + i * 100 + Math.sin(time + i) * 20;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with subtle gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, 'rgba(10, 10, 10, 0.1)');
    gradient.addColorStop(1, 'rgba(26, 26, 46, 0.1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const time = Date.now() * 0.003;

    // Draw connections
    drawConnections(ctx, time * 0.667);

    // Draw layers
    layers.forEach(layer => drawLayer(ctx, layer, time));

    // Draw sacred geometry overlay
    drawSacredGeometry(ctx, time * 0.333);
  }, [layers, drawConnections, drawLayer, drawSacredGeometry]);

  const animate = useCallback(() => {
    draw();

    // Update node activations
    setLayers(prevLayers =>
      prevLayers.map(layer => ({
        ...layer,
        nodes: layer.nodes.map(node => ({
          ...node,
          activation: Math.max(0, Math.min(1, node.activation + (Math.random() - 0.5) * 0.02))
        }))
      }))
    );

    animationRef.current = requestAnimationFrame(animate);
  }, [draw]);

  const resetNetwork = useCallback(() => {
    setLayers([]);
    setConnections([]);
    showMysticalMessage("The sacred network returns to the void, ready for new consciousness...");
  }, [showMysticalMessage]);

  // Calculate metrics
  const totalNodes = layers.reduce((sum, layer) => sum + layer.nodeCount, 0);
  const totalConnections = connections.length;
  const complexity = Math.min(100, totalNodes * 2 + totalConnections * 5);
  const efficiency = Math.max(0, 100 - complexity * 0.5);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      showMysticalMessage("Click upon the sacred canvas to forge your first neural layer...");
    }, 1000);
    return () => clearTimeout(timer);
  }, [showMysticalMessage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white font-['Orbitron'] overflow-hidden">
      {/* Sacred Background */}
      <div className="absolute inset-0 opacity-70">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-purple-500/10 to-cyan-500/10 animate-pulse" />
        {/* Golden Ratio Grid */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 215, 0, 0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 215, 0, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: 'calc(1rem * 1.618) calc(1rem * 1.618)'
          }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 text-center py-6 bg-black/30 backdrop-blur-md border-b-2 border-yellow-500/30">
        <h1 className="text-4xl font-black bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-2">
          NEURAL FORGE
        </h1>
        <p className="text-gray-400 text-sm tracking-[2px] uppercase">
          Architect consciousness and forge neural pathways
        </p>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex h-[calc(100vh-120px)] p-5 gap-5">
        {/* Canvas Area */}
        <div className="flex-[2] bg-black/20 rounded-2xl border-2 border-yellow-500/30 overflow-hidden backdrop-blur-sm">
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-crosshair"
            onClick={addLayer}
          />
        </div>

        {/* Control Panel */}
        <div className="flex-1 bg-black/30 rounded-2xl border-2 border-yellow-500/30 p-5 backdrop-blur-md overflow-y-auto">
          {/* Sacred Layer Types */}
          <div className="mb-6 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
            <h3 className="text-yellow-400 text-center mb-4 text-lg font-semibold">Sacred Layer Types</h3>
            <div className="space-y-3">
              {(['input', 'hidden', 'attention', 'output'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedLayerType(type)}
                  className={`w-full py-3 px-4 rounded-lg border-2 font-semibold uppercase tracking-wider transition-all duration-300 ${
                    selectedLayerType === type
                      ? 'bg-yellow-500/60 border-yellow-400 shadow-lg shadow-yellow-500/50 text-yellow-100'
                      : 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/40 hover:shadow-md hover:shadow-yellow-500/30'
                  }`}
                >
                  {type} Layer
                </button>
              ))}
            </div>
          </div>

          {/* Neural Parameters */}
          <div className="mb-6 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
            <h3 className="text-yellow-400 text-center mb-4 text-lg font-semibold">Neural Parameters</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-yellow-400 text-sm mb-2">
                  Neurons: <span className="font-bold">{nodeCount}</span>
                </label>
                <input
                  type="range"
                  min="3"
                  max="16"
                  value={nodeCount}
                  onChange={(e) => setNodeCount(parseInt(e.target.value))}
                  className="w-full h-2 bg-yellow-500/30 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              <div>
                <label className="block text-yellow-400 text-sm mb-2">
                  Learning Rate: <span className="font-bold">{learningRate.toFixed(3)}</span>
                </label>
                <input
                  type="range"
                  min="0.001"
                  max="0.1"
                  step="0.001"
                  value={learningRate}
                  onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                  className="w-full h-2 bg-yellow-500/30 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              <div>
                <label className="block text-yellow-400 text-sm mb-2">
                  Activation Strength: <span className="font-bold">{activationStrength.toFixed(1)}</span>
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={activationStrength}
                  onChange={(e) => setActivationStrength(parseFloat(e.target.value))}
                  className="w-full h-2 bg-yellow-500/30 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          </div>

          {/* Network Metrics */}
          <div className="mb-6 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
            <h3 className="text-yellow-400 text-center mb-4 text-lg font-semibold">Network Metrics</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black/40 p-3 rounded-lg border border-yellow-500/30 text-center">
                <div className="text-gray-400 text-xs mb-1">Complexity</div>
                <div className="text-yellow-400 text-lg font-bold">{Math.floor(complexity)}</div>
              </div>
              <div className="bg-black/40 p-3 rounded-lg border border-yellow-500/30 text-center">
                <div className="text-gray-400 text-xs mb-1">Efficiency</div>
                <div className="text-yellow-400 text-lg font-bold">{Math.floor(efficiency)}%</div>
              </div>
              <div className="bg-black/40 p-3 rounded-lg border border-yellow-500/30 text-center">
                <div className="text-gray-400 text-xs mb-1">Layers</div>
                <div className="text-yellow-400 text-lg font-bold">{layers.length}</div>
              </div>
              <div className="bg-black/40 p-3 rounded-lg border border-yellow-500/30 text-center">
                <div className="text-gray-400 text-xs mb-1">Connections</div>
                <div className="text-yellow-400 text-lg font-bold">{totalConnections}</div>
              </div>
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={resetNetwork}
            className="w-full py-4 bg-gradient-to-r from-destructive/30 to-deepViolet/30 border-2 border-destructive/50 rounded-xl text-destructive font-semibold uppercase tracking-wider transition-all duration-300 hover:bg-gradient-to-r hover:from-destructive/50 hover:to-deepViolet/50 hover:shadow-lg hover:shadow-destructive/30"
          >
            Reset Sacred Network
          </button>
        </div>
      </div>

      {/* Mystical Voice */}
      <div className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-md px-6 py-4 rounded-full border-2 border-yellow-500/50 text-yellow-400 text-center max-w-4xl transition-all duration-500 ${
        showMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        {mysticalMessage}
      </div>

      {/* Custom Slider Styles will be moved to NeuralForge.css */}
    </div>
  );
};

export default NeuralForge;
