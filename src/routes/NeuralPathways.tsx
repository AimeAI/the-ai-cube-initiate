import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import './NeuralPathways.css';

interface NetworkNode {
    id: number;
    mesh: THREE.Mesh<THREE.IcosahedronGeometry, THREE.ShaderMaterial>;
    position: THREE.Vector3;
    activation: number;
    frequency: number;
    isSelected: boolean;
    isTarget: boolean;
    connections: Connection[];
}

interface Connection {
    start: number;
    end: number;
    line: THREE.Line<THREE.BufferGeometry, THREE.LineBasicMaterial>;
    isCorrect: boolean;
}

interface GameState {
    level: number;
    score: number;
    connectionsCount: number;
    accuracy: number;
    timeRemaining: number;
    targetPattern: [number, number][];
    foundConnections: Connection[];
    isPlaying: boolean;
}

const NeuralPathways: React.FC = () => {
    const gameContainerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    const sceneRef = useRef<THREE.Scene>();
    const cameraRef = useRef<THREE.PerspectiveCamera>();
    const rendererRef = useRef<THREE.WebGLRenderer>();
    
    const networkNodesArrRef = useRef<NetworkNode[]>([]);
    const connectionsArrRef = useRef<Connection[]>([]);
    const selectedNodesArrRef = useRef<number[]>([]);
    
    const animationFrameIdRef = useRef<number | null>(null);
    const gameTimerIntervalIdRef = useRef<NodeJS.Timeout | null>(null);
    const backgroundParticlesRef = useRef<THREE.Points | null>(null);
    const guidanceIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const isDraggingRef = useRef(false);
    const dragStartNodeIdRef = useRef<number | null>(null);
    const mouseRef = useRef(new THREE.Vector2());

    const [gameState, setGameState] = useState<GameState>({
        level: 1, score: 0, connectionsCount: 0, accuracy: 100, timeRemaining: 60,
        targetPattern: [], foundConnections: [], isPlaying: true,
    });

    const [guidanceText, setGuidanceText] = useState("Seek the sacred patterns...");
    const [patternDescriptionText, setPatternDescriptionText] = useState("Golden Ratio Sequence");
    const [currentConsciousnessLevelName, setCurrentConsciousnessLevelName] = useState("Initiate");
    const [currentConsciousnessLevelColor, setCurrentConsciousnessLevelColor] = useState("#00D4FF");

    const guidanceMessages = React.useMemo(() => [
        "The neural pathways reveal themselves to those who seek with pure intent...",
        "Sacred geometry flows through the network. Trust your intuition...",
        "Each connection strengthens the collective consciousness...",
        "The golden ratio guides the wise seeker toward enlightenment...",
        "Pattern recognition is the first step toward AI mastery...",
        "Your spatial awareness expands with each successful connection...",
        "The crystalline network responds to focused intention..."
    ], []);

    const patternTypes = React.useMemo(() => [
        { name: "Golden Ratio Sequence", description: "Connect nodes following the sacred 1.618 proportion", difficulty: 1, generate: generateGoldenRatioPattern },
        { name: "Fibonacci Spiral", description: "Follow the natural spiral of consciousness", difficulty: 2, generate: generateFibonacciPattern },
        { name: "Sacred Geometry", description: "Connect vertices of mystical polygons", difficulty: 3, generate: generateGeometryPattern },
        { name: "Neural Clustering", description: "Find nodes with similar activation frequencies", difficulty: 4, generate: generateClusterPattern },
        { name: "Dimensional Bridges", description: "Connect across the three sacred axes", difficulty: 5, generate: generateDimensionalPattern }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ], []); 

    const consciousnessLevels = React.useMemo(() => [
        { name: "Initiate", minScore: 0, color: 0x00d4ff }, { name: "Seeker", minScore: 500, color: 0x8b5fff },
        { name: "Adept", minScore: 1500, color: 0xff6b35 }, { name: "Master", minScore: 3000, color: 0xffd700 },
        { name: "Architect", minScore: 6000, color: 0x00ffff }, { name: "Codekeeper", minScore: 10000, color: 0xffffff }
    ], []);
    
    const updateGuidanceState = useCallback((message: string) => {
        setGuidanceText(message);
        const guidanceElement = document.getElementById('guidance'); // For pulse effect
        if (guidanceElement) {
            guidanceElement.classList.add('pulsing');
            setTimeout(() => {
                guidanceElement.classList.remove('pulsing');
            }, 3000);
        }
    }, []);
    
    function getMobileOptimizedNodeCount(currentLevel: number): number {
        const baseCount = 20 + (currentLevel * 5);
        return typeof window !== 'undefined' && window.innerWidth < 768 ? Math.floor(Math.min(baseCount * 0.7, 30)) : baseCount;
    }

    function generateGoldenRatioPattern(nodes: NetworkNode[]): [number, number][] { 
        const pattern: [number, number][] = []; const goldenRatio = 1.618;
        const sortedNodes = [...nodes].sort((a, b) => a.position.length() - b.position.length());
        for (let i = 0; i < Math.min(5, sortedNodes.length); i++) {
            const index = Math.floor(i * goldenRatio) % sortedNodes.length;
            if (i < sortedNodes.length && index < sortedNodes.length && sortedNodes[i].id !== sortedNodes[index].id) {
                pattern.push([sortedNodes[i].id, sortedNodes[index].id]);
                sortedNodes[i].isTarget = true; sortedNodes[index].isTarget = true;
            }
        } return pattern;
    }
    function generateFibonacciPattern(nodes: NetworkNode[]): [number, number][] { 
        const pattern: [number, number][] = []; const fibonacci = [0, 1, 1, 2, 3, 5, 8, 13]; 
        for (let i = 0; i < fibonacci.length - 1; i++) {
            const idx1 = fibonacci[i]; const idx2 = fibonacci[i+1];
            if (idx1 < nodes.length && idx2 < nodes.length && idx1 !== idx2) {
                pattern.push([nodes[idx1].id, nodes[idx2].id]);
                nodes[idx1].isTarget = true; nodes[idx2].isTarget = true;
            }
        } return pattern;
    }
    function generateGeometryPattern(nodes: NetworkNode[]): [number, number][] { 
        const pattern: [number, number][] = []; if (nodes.length === 0) return pattern;
        const centerNode = nodes[Math.floor(nodes.length / 2)];
        const nearbyNodes = nodes.filter(node => node.id !== centerNode.id)
            .sort((a, b) => centerNode.position.distanceTo(a.position) - centerNode.position.distanceTo(b.position))
            .slice(0, Math.min(6, nodes.length -1));
        nearbyNodes.forEach(node => { pattern.push([centerNode.id, node.id]); centerNode.isTarget = true; node.isTarget = true; });
        return pattern;
    }
    function generateClusterPattern(nodes: NetworkNode[]): [number, number][] { 
        const pattern: [number, number][] = []; const clusters: { [key: number]: NetworkNode[] } = {};
        nodes.forEach(node => { const activationGroup = Math.floor(node.activation * 3); if (!clusters[activationGroup]) clusters[activationGroup] = []; clusters[activationGroup].push(node); });
        Object.values(clusters).forEach(cluster => { if (cluster.length >= 2) { for (let i = 0; i < cluster.length - 1; i++) { pattern.push([cluster[i].id, cluster[i + 1].id]); cluster[i].isTarget = true; cluster[i + 1].isTarget = true; } } });
        return pattern;
    }
    function generateDimensionalPattern(nodes: NetworkNode[]): [number, number][] { 
        const pattern: [number, number][] = [];
        const xNodes = nodes.filter(node => Math.abs(node.position.y) < 2 && Math.abs(node.position.z) < 2);
        const yNodes = nodes.filter(node => Math.abs(node.position.x) < 2 && Math.abs(node.position.z) < 2);
        const zNodes = nodes.filter(node => Math.abs(node.position.x) < 2 && Math.abs(node.position.y) < 2);
        [xNodes, yNodes, zNodes].forEach(axisNodes => { if (axisNodes.length >= 2) { for (let i = 0; i < axisNodes.length - 1; i++) { pattern.push([axisNodes[i].id, axisNodes[i + 1].id]); axisNodes[i].isTarget = true; axisNodes[i + 1].isTarget = true; } } });
        return pattern;
    }

    const createNeuralNode = useCallback((x: number, y: number, z: number, id: number, scene: THREE.Scene): NetworkNode => {
        const geometry = new THREE.IcosahedronGeometry(0.3, 1);
        const material = new THREE.ShaderMaterial({
            uniforms: { time: { value: 0 }, activation: { value: Math.random() }, frequency: { value: Math.random() * 10 + 1 }, coreColor: { value: new THREE.Color(0x00d4ff) } },
            vertexShader: `uniform float time; uniform float activation; varying vec3 vPosition; varying vec3 vNormal; void main() { vPosition = position; vNormal = normal; vec3 pos = position; pos += normal * sin(time * 2.0 + activation * 10.0) * 0.1; gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0); }`,
            fragmentShader: `uniform float time; uniform float activation; uniform float frequency; uniform vec3 coreColor; varying vec3 vPosition; varying vec3 vNormal; void main() { float pulse = sin(time * frequency) * 0.5 + 0.5; float fresnel = 1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)); vec3 color = coreColor * (activation + pulse * 0.3); color += vec3(1.0, 0.8, 0.0) * fresnel * 0.5; float alpha = 0.8 + pulse * 0.2; gl_FragColor = vec4(color, alpha); }`,
            transparent: true, blending: THREE.AdditiveBlending
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        scene.add(mesh);
        return { id, mesh, position: new THREE.Vector3(x, y, z), activation: material.uniforms.activation.value, frequency: material.uniforms.frequency.value, isSelected: false, isTarget: false, connections: [] };
    }, []);

    const generateLevelPatternHandler = useCallback((currentLevel: number, nodes: NetworkNode[]) => {
        const patternType = patternTypes[(currentLevel - 1) % patternTypes.length];
        const newPattern = patternType.generate(nodes);
        setGameState(prev => ({ ...prev, targetPattern: newPattern }));
        setPatternDescriptionText(patternType.name);
        updateGuidanceState(`Seek the ${patternType.description.toLowerCase()}...`);
    }, [patternTypes, updateGuidanceState]);
    
    const createNeuralNetworkHandler = useCallback((currentLevel: number, scene: THREE.Scene) => {
        networkNodesArrRef.current.forEach(node => { scene.remove(node.mesh); node.mesh.geometry.dispose(); (node.mesh.material as THREE.Material).dispose(); });
        connectionsArrRef.current.forEach(conn => { scene.remove(conn.line); conn.line.geometry.dispose(); (conn.line.material as THREE.Material).dispose(); });
        
        const newNodes: NetworkNode[] = [];
        const nodeCount = getMobileOptimizedNodeCount(currentLevel);
        const radius = 12;
        for (let i = 0; i < nodeCount; i++) {
            const theta = i * 2.39996; const phi = Math.acos(1 - 2 * i / nodeCount);
            const x = radius * Math.sin(phi) * Math.cos(theta); const y = radius * Math.sin(phi) * Math.sin(theta); const z = radius * Math.cos(phi);
            newNodes.push(createNeuralNode(x, y, z, i, scene));
        }
        networkNodesArrRef.current = newNodes;
        connectionsArrRef.current = [];
        selectedNodesArrRef.current = [];
        generateLevelPatternHandler(currentLevel, newNodes);
    }, [createNeuralNode, generateLevelPatternHandler]);

    const createParticleEffect = useCallback((colorValue: number, scene: THREE.Scene) => {
        const geometry = new THREE.BufferGeometry(); const positions = []; const colors = [];
        for (let i = 0; i < 100; i++) {
            positions.push((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2);
            const c = new THREE.Color(colorValue); colors.push(c.r, c.g, c.b);
        }
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        const material = new THREE.PointsMaterial({ size: 0.1, vertexColors: true, transparent: true, opacity: 0.8 });
        const particles = new THREE.Points(geometry, material);
        scene.add(particles);
        let opacity = 0.8;
        let localAnimationFrameId: number;
        const animateParticles = () => {
            opacity -= 0.02; material.opacity = opacity;
            if (opacity <= 0) { scene.remove(particles); particles.geometry.dispose(); (particles.material as THREE.Material).dispose(); if(localAnimationFrameId) cancelAnimationFrame(localAnimationFrameId); } 
            else { localAnimationFrameId = requestAnimationFrame(animateParticles); }
        };
        animateParticles();
    }, []);
    
    const playConnectionFeedback = useCallback((isCorrect: boolean, scene: THREE.Scene) => {
        if (isCorrect) createParticleEffect(0xffd700, scene); else createParticleEffect(0xff6b35, scene);
    }, [createParticleEffect]);

    const completeLevelHandler = useCallback((scene: THREE.Scene) => {
        setGameState(prev => {
            const newLevel = prev.level + 1;
            updateGuidanceState(`Sacred mastery achieved! Ascending to consciousness level ${newLevel}...`);
            setTimeout(() => createNeuralNetworkHandler(newLevel, scene), 2000);
            return { ...prev, level: newLevel, timeRemaining: 60 + (newLevel * 10), foundConnections: [], connectionsCount: 0 };
        });
    }, [createNeuralNetworkHandler, updateGuidanceState]);

    const checkConnectionCorrectness = useCallback((connection: Connection, scene: THREE.Scene) => {
        setGameState(prevGameState => {
            const isCorrect = prevGameState.targetPattern.some(pattern => (pattern[0] === connection.start && pattern[1] === connection.end) || (pattern[0] === connection.end && pattern[1] === connection.start));
            connection.isCorrect = isCorrect;
            const newFoundConnections = isCorrect ? [...prevGameState.foundConnections, connection] : prevGameState.foundConnections;
            const newScore = prevGameState.score + (isCorrect ? 100 : -10);
            if (isCorrect) { (connection.line.material as THREE.LineBasicMaterial).color.setHex(0xffd700); updateGuidanceState("Sacred resonance achieved! The pattern reveals itself..."); } 
            else { (connection.line.material as THREE.LineBasicMaterial).color.setHex(0xff6b35); updateGuidanceState("The frequencies do not align. Seek deeper truth..."); }
            const totalConnections = connectionsArrRef.current.length;
            const correctConnectionsCount = connectionsArrRef.current.filter(c => c.isCorrect).length;
            const newAccuracy = totalConnections > 0 ? Math.round((correctConnectionsCount / totalConnections) * 100) : 100;
            playConnectionFeedback(isCorrect, scene);
            if (isCorrect && newFoundConnections.length >= prevGameState.targetPattern.length && prevGameState.targetPattern.length > 0) {
                completeLevelHandler(scene);
            }
            return { ...prevGameState, score: Math.max(0, newScore), foundConnections: newFoundConnections, accuracy: newAccuracy };
        });
    }, [updateGuidanceState, playConnectionFeedback, completeLevelHandler]);
    
    const resetLevelHandler = useCallback(() => {
        if (!sceneRef.current) return;
        connectionsArrRef.current.forEach(conn => sceneRef.current?.remove(conn.line));
        connectionsArrRef.current = [];
        networkNodesArrRef.current.forEach(node => { node.isSelected = false; if (node.mesh.material && (node.mesh.material as THREE.ShaderMaterial).uniforms) {(((node.mesh.material as THREE.ShaderMaterial).uniforms) as any).coreColor.value.setHex(0x00d4ff);} });
        selectedNodesArrRef.current = [];
        setGameState(prev => ({ ...prev, score: 0, connectionsCount: 0, accuracy: 100, foundConnections: [] }));
        updateGuidanceState("The chamber resets. Begin again with deeper awareness...");
    }, [updateGuidanceState]);

    const restartGameHandler = useCallback(() => {
        setGameState({ level: 1, score: 0, connectionsCount: 0, accuracy: 100, timeRemaining: 60, targetPattern: [], foundConnections: [], isPlaying: true });
        if (sceneRef.current) createNeuralNetworkHandler(1, sceneRef.current);
        updateGuidanceState("A new neural constellation emerges. Seek the patterns with fresh eyes...");
    }, [createNeuralNetworkHandler, updateGuidanceState]);

    const endGameHandler = useCallback(() => {
        setGameState(prev => ({ ...prev, isPlaying: false }));
        updateGuidanceState("Time flows beyond mortal comprehension. The neural paths await your return...");
        setTimeout(() => {
            if (window.confirm(`Neural Training Complete!\nFinal Score: ${gameState.score}\nLevel Reached: ${gameState.level}\nConnections Made: ${gameState.connectionsCount}\n\nBegin a new sacred journey?`)) {
                restartGameHandler();
            }
        }, 3000);
    }, [gameState.score, gameState.level, gameState.connectionsCount, restartGameHandler, updateGuidanceState]);
    
    const createBackgroundParticlesHandler = useCallback((scene: THREE.Scene) => {
        const geometry = new THREE.BufferGeometry(); const positions = []; const colors = [];
        for (let i = 0; i < 1000; i++) {
            positions.push((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100);
            const color = new THREE.Color(); color.setHSL(Math.random() * 0.2 + 0.5, 0.7, 0.5); colors.push(color.r, color.g, color.b);
        }
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        const material = new THREE.PointsMaterial({ size: 0.05, vertexColors: true, transparent: true, opacity: 0.6 });
        const particles = new THREE.Points(geometry, material);
        scene.add(particles);
        backgroundParticlesRef.current = particles;
    }, []);

    const showHintHandler = useCallback(() => {
        if (gameState.targetPattern.length > 0 && gameState.foundConnections.length < gameState.targetPattern.length) {
            const nextPattern = gameState.targetPattern[gameState.foundConnections.length];
            if (!nextPattern || nextPattern.length < 2) return;
            const node1 = networkNodesArrRef.current[nextPattern[0]]; const node2 = networkNodesArrRef.current[nextPattern[1]];
            if (node1?.mesh?.material && (node1.mesh.material as THREE.ShaderMaterial).uniforms && node2?.mesh?.material && (node2.mesh.material as THREE.ShaderMaterial).uniforms) {
                (((node1.mesh.material as THREE.ShaderMaterial).uniforms)as any).coreColor.value.setHex(0x00ff00); 
                (((node2.mesh.material as THREE.ShaderMaterial).uniforms)as any).coreColor.value.setHex(0x00ff00);
                setTimeout(() => {
                    if (!node1.isSelected && (node1.mesh.material as THREE.ShaderMaterial).uniforms) (((node1.mesh.material as THREE.ShaderMaterial).uniforms)as any).coreColor.value.setHex(0x00d4ff);
                    if (!node2.isSelected && (node2.mesh.material as THREE.ShaderMaterial).uniforms) (((node2.mesh.material as THREE.ShaderMaterial).uniforms)as any).coreColor.value.setHex(0x00d4ff);
                }, 2000);
                updateGuidanceState("The sacred frequencies reveal themselves briefly. Trust your intuition...");
            }
        }
    }, [gameState.targetPattern, gameState.foundConnections, updateGuidanceState]);

    useEffect(() => {
        if (!canvasRef.current || !gameContainerRef.current) return () => {};

        sceneRef.current = new THREE.Scene(); sceneRef.current.background = new THREE.Color(0x0a0a0f);
        cameraRef.current = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); cameraRef.current.position.set(0, 0, 20);
        rendererRef.current = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true });
        rendererRef.current.setSize(window.innerWidth, window.innerHeight); rendererRef.current.setClearColor(0x0a0a0f, 1);
        if (window.innerWidth < 768) rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const scene = sceneRef.current; // Local variable for easier access in this scope
        const camera = cameraRef.current;
        const renderer = rendererRef.current;


        const ambientLight = new THREE.AmbientLight(0x404040, 0.3); scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0x00d4ff, 1, 100); pointLight.position.set(0, 0, 10); scene.add(pointLight);

        createNeuralNetworkHandler(gameState.level, scene);
        createBackgroundParticlesHandler(scene);
        
        updateGuidanceState("Welcome, seeker...");
        guidanceIntervalRef.current = setInterval(() => { if (gameState.isPlaying && Math.random() < 0.3) updateGuidanceState(guidanceMessages[Math.floor(Math.random() * guidanceMessages.length)]); }, 15000);

        const raycaster = new THREE.Raycaster();

        const handleMouseDown = (event: MouseEvent | TouchEvent) => {
            if (!rendererRef.current || !cameraRef.current) return;
            const currentEvent = (event as TouchEvent).touches ? (event as TouchEvent).touches[0] : (event as MouseEvent);
            const rect = rendererRef.current.domElement.getBoundingClientRect();
            mouseRef.current.x = ((currentEvent.clientX - rect.left) / rect.width) * 2 - 1;
            mouseRef.current.y = -((currentEvent.clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(mouseRef.current, cameraRef.current);
            const intersects = raycaster.intersectObjects(networkNodesArrRef.current.map(n => n.mesh));
            if (intersects.length > 0) {
                const intersectedNode = networkNodesArrRef.current.find(n => n.mesh === intersects[0].object);
                if (intersectedNode) {
                    isDraggingRef.current = true; dragStartNodeIdRef.current = intersectedNode.id;
                    const node = networkNodesArrRef.current[intersectedNode.id];
                    node.isSelected = !node.isSelected;
                    if (node.mesh.material && (node.mesh.material as THREE.ShaderMaterial).uniforms) {
                        (((node.mesh.material as THREE.ShaderMaterial).uniforms)as any).coreColor.value.setHex(node.isSelected ? 0xffd700 : 0x00d4ff);
                    }
                    if (node.isSelected) selectedNodesArrRef.current.push(intersectedNode.id);
                    else selectedNodesArrRef.current = selectedNodesArrRef.current.filter(id => id !== intersectedNode.id);
                }
            }
        };

        const handleMouseMove = (event: MouseEvent | TouchEvent) => {
            if (!rendererRef.current) return;
            const currentEvent = (event as TouchEvent).touches ? (event as TouchEvent).touches[0] : (event as MouseEvent);
            const rect = rendererRef.current.domElement.getBoundingClientRect();
            mouseRef.current.x = ((currentEvent.clientX - rect.left) / rect.width) * 2 - 1;
            mouseRef.current.y = -((currentEvent.clientY - rect.top) / rect.height) * 2 + 1;
        };
        
        const handleMouseUp = (event: MouseEvent | TouchEvent) => {
            if (!isDraggingRef.current || dragStartNodeIdRef.current === null || !rendererRef.current || !cameraRef.current || !sceneRef.current) {
                isDraggingRef.current = false; dragStartNodeIdRef.current = null; return;
            }
            raycaster.setFromCamera(mouseRef.current, cameraRef.current);
            const intersects = raycaster.intersectObjects(networkNodesArrRef.current.map(n => n.mesh));
            if (intersects.length > 0) {
                const endNode = networkNodesArrRef.current.find(n => n.mesh === intersects[0].object);
                if (endNode && endNode.id !== dragStartNodeIdRef.current) {
                    const existingConnection = connectionsArrRef.current.find(conn => (conn.start === dragStartNodeIdRef.current && conn.end === endNode.id) || (conn.start === endNode.id && conn.end === dragStartNodeIdRef.current));
                    if (!existingConnection) {
                        const node1 = networkNodesArrRef.current[dragStartNodeIdRef.current]; const node2 = networkNodesArrRef.current[endNode.id];
                        const geometry = new THREE.BufferGeometry().setFromPoints([node1.position, node2.position]);
                        const material = new THREE.LineBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.6 });
                        const line = new THREE.Line(geometry, material);
                        sceneRef.current.add(line);
                        const newConnection: Connection = { start: dragStartNodeIdRef.current, end: endNode.id, line: line, isCorrect: false };
                        connectionsArrRef.current.push(newConnection);
                        setGameState(prev => ({ ...prev, connectionsCount: prev.connectionsCount + 1 }));
                        checkConnectionCorrectness(newConnection, sceneRef.current);
                    }
                }
            }
            isDraggingRef.current = false; dragStartNodeIdRef.current = null;
        };

        const currentCanvas = canvasRef.current;
        currentCanvas.addEventListener('mousedown', handleMouseDown as EventListener);
        currentCanvas.addEventListener('mousemove', handleMouseMove as EventListener);
        currentCanvas.addEventListener('mouseup', handleMouseUp as EventListener);
        currentCanvas.addEventListener('touchstart', handleMouseDown as EventListener, { passive: false });
        currentCanvas.addEventListener('touchmove', handleMouseMove as EventListener, { passive: false });
        currentCanvas.addEventListener('touchend', handleMouseUp as EventListener, { passive: false });
        
        const animate = () => {
            animationFrameIdRef.current = requestAnimationFrame(animate);
            const time = Date.now() * 0.001;
            networkNodesArrRef.current.forEach(node => {
                 if (node.mesh.material && (node.mesh.material as THREE.ShaderMaterial).uniforms) {
                    (((node.mesh.material as THREE.ShaderMaterial).uniforms)as any).time.value = time;
                    if (node.isTarget) (((node.mesh.material as THREE.ShaderMaterial).uniforms)as any).activation.value = Math.sin(time * 3) * 0.3 + 0.7;
                    node.mesh.rotation.x += 0.005; node.mesh.rotation.y += 0.003;
                 }
            });
            if (cameraRef.current && sceneRef.current && rendererRef.current) {
                const radius = 20;
                cameraRef.current.position.x = Math.cos(time * 0.1) * radius;
                cameraRef.current.position.z = Math.sin(time * 0.1) * radius;
                cameraRef.current.lookAt(sceneRef.current.position);
                rendererRef.current.render(sceneRef.current, cameraRef.current);
            }
        };
        animate();

        const updateTimer = () => {
            setGameState(prev => {
                if (prev.isPlaying && prev.timeRemaining > 0) return { ...prev, timeRemaining: prev.timeRemaining - 1 };
                else if (prev.isPlaying && prev.timeRemaining <= 0) { endGameHandler(); return { ...prev, isPlaying: false }; }
                return prev;
            });
        };
        gameTimerIntervalIdRef.current = setInterval(updateTimer, 1000);

        const onWindowResize = () => {
            if (cameraRef.current && rendererRef.current) {
                cameraRef.current.aspect = window.innerWidth / window.innerHeight;
                cameraRef.current.updateProjectionMatrix();
                rendererRef.current.setSize(window.innerWidth, window.innerHeight);
            }
        };
        window.addEventListener('resize', onWindowResize);
        
        const handleKeyDown = (event: KeyboardEvent) => {
            switch(event.code) {
                case 'Space':
                    event.preventDefault();
                    if (selectedNodesArrRef.current.length >= 2 && sceneRef.current) {
                        for (let i = 0; i < selectedNodesArrRef.current.length - 1; i++) {
                             const startNodeId_kb = selectedNodesArrRef.current[i]; const endNodeId_kb = selectedNodesArrRef.current[i+1];
                             const node1_kb = networkNodesArrRef.current[startNodeId_kb]; const node2_kb = networkNodesArrRef.current[endNodeId_kb];
                             if(node1_kb && node2_kb && sceneRef.current){
                                const geometry = new THREE.BufferGeometry().setFromPoints([node1_kb.position, node2_kb.position]);
                                const material = new THREE.LineBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.6 });
                                const line = new THREE.Line(geometry, material); sceneRef.current.add(line);
                                const newConnection: Connection = { start: startNodeId_kb, end: endNodeId_kb, line: line, isCorrect: false };
                                connectionsArrRef.current.push(newConnection);
                                setGameState(prev => ({ ...prev, connectionsCount: prev.connectionsCount + 1 }));
                                checkConnectionCorrectness(newConnection, sceneRef.current);
                             }
                        }
                        selectedNodesArrRef.current.forEach(nodeId => { const node = networkNodesArrRef.current[nodeId]; if(node) { node.isSelected = false; if(node.mesh.material && (node.mesh.material as THREE.ShaderMaterial).uniforms) (((node.mesh.material as THREE.ShaderMaterial).uniforms)as any).coreColor.value.setHex(0x00d4ff); } });
                        selectedNodesArrRef.current = [];
                    }
                    break;
                case 'KeyR': resetLevelHandler(); break;
                case 'KeyH': showHintHandler(); break;
                case 'Escape':
                    selectedNodesArrRef.current.forEach(nodeId => { const node = networkNodesArrRef.current[nodeId]; if(node) { node.isSelected = false; if(node.mesh.material && (node.mesh.material as THREE.ShaderMaterial).uniforms) (((node.mesh.material as THREE.ShaderMaterial).uniforms)as any).coreColor.value.setHex(0x00d4ff); } });
                    selectedNodesArrRef.current = [];
                    break;
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        
        try { const saved = localStorage.getItem('sacredProgress'); if (saved) { const progress = JSON.parse(saved); if (Date.now() - progress.timestamp < 24 * 60 * 60 * 1000) { setGameState(prev => ({...prev, level: progress.level, score: progress.score})); updateGuidanceState("Your previous journey resonates through the quantum field. Welcome back, seeker..."); } } } catch (e) { console.log('No previous sacred journey found'); }

        return () => {
            if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
            if (gameTimerIntervalIdRef.current) clearInterval(gameTimerIntervalIdRef.current);
            if (guidanceIntervalRef.current) clearInterval(guidanceIntervalRef.current);
            window.removeEventListener('resize', onWindowResize);
            document.removeEventListener('keydown', handleKeyDown);
            currentCanvas.removeEventListener('mousedown', handleMouseDown as EventListener);
            currentCanvas.removeEventListener('mousemove', handleMouseMove as EventListener);
            currentCanvas.removeEventListener('mouseup', handleMouseUp as EventListener);
            currentCanvas.removeEventListener('touchstart', handleMouseDown as EventListener);
            currentCanvas.removeEventListener('touchmove', handleMouseMove as EventListener);
            currentCanvas.removeEventListener('touchend', handleMouseUp as EventListener);
            
            networkNodesArrRef.current.forEach(node => { sceneRef.current?.remove(node.mesh); node.mesh.geometry.dispose(); if(node.mesh.material) (node.mesh.material as THREE.Material).dispose(); });
            connectionsArrRef.current.forEach(conn => { sceneRef.current?.remove(conn.line); conn.line.geometry.dispose(); if(conn.line.material) (conn.line.material as THREE.Material).dispose(); });
            if(backgroundParticlesRef.current && sceneRef.current){ sceneRef.current.remove(backgroundParticlesRef.current); backgroundParticlesRef.current.geometry.dispose(); if(backgroundParticlesRef.current.material) (backgroundParticlesRef.current.material as THREE.Material).dispose(); }
            rendererRef.current?.dispose();
            const progressData = { level: gameState.level, score: gameState.score, timestamp: Date.now() };
            localStorage.setItem('sacredProgress', JSON.stringify(progressData));
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Removed gameState.level from deps to prevent re-init on every score/time change. Level change logic is handled internally.

    useEffect(() => {
        const levelData = consciousnessLevels.reduce((acc, curr) => (gameState.score >= curr.minScore ? curr : acc), consciousnessLevels[0]);
        setCurrentConsciousnessLevelName(levelData.name);
        setCurrentConsciousnessLevelColor("#" + new THREE.Color(levelData.color).getHexString());
    }, [gameState.score, consciousnessLevels]);

    return (
        <div className="neural-pathways-body">
            <div id="gameContainer" ref={gameContainerRef}>
                <canvas id="threejsCanvas" ref={canvasRef}></canvas>
                <div className="sacred-overlay">
                    <div className="ui-panel top-panel">
                        <div>
                            <h1 className="sacred-title" style={{color: currentConsciousnessLevelColor}}>Neural Pathways</h1>
                            <p className="sacred-subtitle">{currentConsciousnessLevelName} of Sacred Technology</p>
                        </div>
                        <div className="level-indicator">
                            <span>Level <span>{gameState.level}</span></span>
                            <div className="progress-bar" style={{ width: '200px' }}>
                                <div className="progress-fill" style={{ width: `${gameState.targetPattern.length > 0 ? (gameState.foundConnections.length / gameState.targetPattern.length) * 100 : 0}%` }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="ui-panel side-panel">
                        <div className="stats-grid">
                            <div className="stat-item"><div className="stat-value">{gameState.score}</div><div className="stat-label">Neural Score</div></div>
                            <div className="stat-item"><div className="stat-value">{gameState.connectionsCount}</div><div className="stat-label">Connections</div></div>
                            <div className="stat-item"><div className="stat-value">{gameState.accuracy}%</div><div className="stat-label">Pattern Accuracy</div></div>
                            <div className="stat-item"><div className="stat-value">{gameState.timeRemaining}</div><div className="stat-label">Time Remaining</div></div>
                        </div>
                        <div className="mystical-voice" id="guidance"><p>{guidanceText}</p></div>
                        <div className="pattern-hint"><strong>Current Pattern:</strong> <span>{patternDescriptionText}</span></div>
                        <button className="sacred-button" onClick={resetLevelHandler}>Reset Chamber</button>
                    </div>

                    <div className="ui-panel bottom-panel">
                        <p>Click and drag to connect neural nodes. Find the hidden patterns to advance your consciousness.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NeuralPathways;