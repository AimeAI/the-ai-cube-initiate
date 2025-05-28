import React, { useState, useEffect, useRef } from 'react';
// Suspense, useCallback, Canvas, useFrame, useThree were removed as they are not used in the current vanilla Three.js implementation.
import * as THREE from 'three';

// Defines the cubic boundary of the game world (12x12x12)
const GRID_SIZE = 12;
type GameState = 'intro' | 'lesson' | 'playing' | 'levelComplete' | 'gameover' | 'victory';

// Level configurations: theme, speed, nodes to collect, and educational content
const LEVELS = [
  {
    name: "Digital Grid",
    theme: { primary: "#00D4FF", secondary: "#0088ff", accent: "#00ff88", background: "#0A0A0F" },
    speed: 600, // milliseconds per snake move
    requiredNodes: 3,
    gridPattern: 'standard', // Placeholder for future grid variations
    lesson: {
      title: "Welcome to Programming!",
      content: "In programming, we give instructions to computers. Just like telling the snake where to go!\n\nYour snake follows commands:\n• Arrow Keys = Turn or change layer\n• Spacebar = Auto-aim towards goal\n• Collect data nodes (glowing orbs) to grow and complete the level.\n\nLet's practice controlling our digital snake!"
    }
  },
  {
    name: "Matrix Code",
    theme: { primary: "#00ff00", secondary: "#008800", accent: "#88ff88", background: "#050A05" },
    speed: 550,
    requiredNodes: 4,
    gridPattern: 'matrix',
    lesson: {
      title: "Loops in Programming",
      content: "Your snake moves in a loop - it keeps going until something changes!\n\nIn programming, loops repeat actions:\n• `while (playing) { move_forward(); }`\n• `if (hit_wall_or_self) { game_over(); }`\n\nCollect 4 nodes while avoiding collisions!"
    }
  },
  {
    name: "Neon City",
    theme: { primary: "#ff00ff", secondary: "#8800ff", accent: "#ffff00", background: "#0A050A" },
    speed: 500,
    requiredNodes: 5,
    gridPattern: 'city',
    lesson: {
      title: "Conditions & Logic",
      content: "Programs make decisions using IF statements!\n\nYour snake checks conditions:\n• `IF (space_ahead_is_empty) THEN move()`\n• `IF (data_node_found) THEN grow()`\n• `IF (hit_wall_or_self) THEN game_over()`\n\nUse logic to navigate safely and collect 5 nodes!"
    }
  },
  {
    name: "Cyber Ocean",
    theme: { primary: "#00ffff", secondary: "#0066ff", accent: "#ffffff", background: "#050A0A" },
    speed: 450,
    requiredNodes: 6,
    gridPattern: 'waves',
    lesson: {
      title: "Variables & Data",
      content: "Variables store information in programs!\n\nYour snake uses variables like:\n• `position = [x, y, z]` (its coordinates)\n• `length = number_of_segments`\n• `score = nodes_collected`\n\nCollect 6 data nodes to see these 'variables' change!"
    }
  },
  {
    name: "Quantum Realm",
    theme: { primary: "#ff6600", secondary: "#ffcc00", accent: "#ff00ff", background: "#0A0705" },
    speed: 400,
    requiredNodes: 7,
    gridPattern: 'quantum',
    lesson: {
      title: "Functions & Methods",
      content: "Functions are reusable blocks of code that perform specific tasks.\n\nYour snake uses functions like:\n• `move()` → changes its position\n• `grow()` → adds new segments\n• `checkCollision()` → detects if it hits something\n\nMaster these concepts to collect 7 nodes and complete the game!"
    }
  }
];

// Generates a random position within the GRID_SIZE
function getRandomPosition(existingSegments: number[][] = []): [number, number, number] {
  let position: [number, number, number];
  let attempts = 0;
  do {
    position = [
      Math.floor(Math.random() * GRID_SIZE),
      Math.floor(Math.random() * GRID_SIZE),
      Math.floor(Math.random() * GRID_SIZE),
    ];
    attempts++;
    // Ensure the new position is not on an existing snake segment.
  } while (existingSegments.some(seg => seg[0] === position[0] && seg[1] === position[1] && seg[2] === position[2]) && attempts < 50);
  return position;
}

// Game Heads-Up Display Component
const GameHUD = ({ score, level, nodesNeeded }: { score: number, level: number, nodesNeeded: number }) => (
  <div style={{
    position: 'absolute',
    top: 20,
    left: 20,
    color: 'white',
    fontFamily: "'Orbitron', sans-serif",
    fontSize: '18px',
    zIndex: 100,
    background: 'rgba(0, 0, 0, 0.85)',
    padding: '15px',
    borderRadius: '10px',
    border: `2px solid ${LEVELS[level].theme.primary}`,
    boxShadow: `0 0 15px ${LEVELS[level].theme.primary}55`
  }}>
    <div style={{ color: LEVELS[level].theme.primary, fontWeight: 'bold', marginBottom: '5px' }}>
      Level {level + 1}: {LEVELS[level].name}
    </div>
    <div>Nodes: {score} / {nodesNeeded}</div>
  </div>
);

// Main Game Component
function App(): JSX.Element {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const snakeRef = useRef<THREE.Group | null>(null);
  const dataNodeRef = useRef<THREE.Mesh | null>(null);
  const frameRef = useRef<number>(0);
  const arrowRef = useRef<THREE.Mesh | null>(null);

  const [snakeSegments, setSnakeSegments] = useState<number[][]>([[Math.floor(GRID_SIZE/2), Math.floor(GRID_SIZE/2), Math.floor(GRID_SIZE/2)]]);
  const [direction, setDirection] = useState<[number, number, number]>([1, 0, 0]); 
  const [dataNodePosition, setDataNodePosition] = useState<[number, number, number]>(getRandomPosition(snakeSegments));
  const [score, setScore] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [gameState, setGameState] = useState<GameState>('intro');
  const [totalNodesCollected, setTotalNodesCollected] = useState(0);
  const [isAiModeActive, setIsAiModeActive] = useState(false);
  const [showAiHintPopup, setShowAiHintPopup] = useState(false);
  const [aiHintShownThisLevel, setAiHintShownThisLevel] = useState(false);
  const [aiButtonEverClicked, setAiButtonEverClicked] = useState(false);

  // Camera control states
  const [cameraDistance, setCameraDistance] = useState(25);
  const [cameraAzimuthAngle, setCameraAzimuthAngle] = useState(Math.PI / 4); 
  const [cameraPolarAngle, setCameraPolarAngle] = useState(Math.PI / 4); 
  const [isMouseDown, setIsMouseDown] = useState(false);
  const lastMousePositionRef = useRef<{ x: number, y: number } | null>(null);


  // Helper function to calculate direction towards data node
  const getDirectionTowardsNode = (head: number[], node: number[]): [number, number, number] => {
    const dx = node[0] - head[0];
    const dy = node[1] - head[1];
    const dz = node[2] - head[2];

    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    const absDz = Math.abs(dz);

    if (absDx >= absDy && absDx >= absDz && dx !== 0) {
      return [Math.sign(dx), 0, 0];
    } else if (absDy >= absDx && absDy >= absDz && dy !== 0) {
      return [0, Math.sign(dy), 0];
    } else if (dz !== 0) {
      return [0, 0, Math.sign(dz)];
    }
    if (dx !== 0) return [Math.sign(dx), 0, 0];
    if (dy !== 0) return [0, Math.sign(dy), 0];
    if (dz !== 0) return [0, 0, Math.sign(dz)];
    
  };

  const getAiDirection = (
    currentSnakeSegments: number[][],
    nodePosition: [number, number, number],
    currentDirection: [number, number, number]
  ): [number, number, number] => {
    const head = currentSnakeSegments[0];
    
    // --- Start of new AI logic: Prioritize direct path ---
    const idealDirection = getDirectionTowardsNode(head, nodePosition);
    let isIdealDirectionSafe = true;

    // Check for 180-degree turn
    if (
        currentSnakeSegments.length > 1 &&
        idealDirection[0] === -currentDirection[0] &&
        idealDirection[1] === -currentDirection[1] &&
        idealDirection[2] === -currentDirection[2]
    ) {
        isIdealDirectionSafe = false;
    }

    if (isIdealDirectionSafe) {
        const idealNewHead: [number, number, number] = [
            (head[0] + idealDirection[0] + GRID_SIZE) % GRID_SIZE,
            (head[1] + idealDirection[1] + GRID_SIZE) % GRID_SIZE,
            (head[2] + idealDirection[2] + GRID_SIZE) % GRID_SIZE,
        ];

        const idealCollision = currentSnakeSegments.some(
            (segment, index) => index < currentSnakeSegments.length - 1 && segment[0] === idealNewHead[0] && segment[1] === idealNewHead[1] && segment[2] === idealNewHead[2]
        );

        if (!idealCollision) {
            return idealDirection; // Take the direct safe path
        }
    }
    // --- End of new AI logic: Fallback to broader search if direct path is unsafe ---

    const possibleMoves: { dir: [number, number, number]; dist: number; newHead: [number,number,number] }[] = [];

    // Define potential directions (6 cardinal directions)
    const DIRS: [number, number, number][] = [
      [1, 0, 0], [-1, 0, 0],
      [0, 1, 0], [0, -1, 0],
      [0, 0, 1], [0, 0, -1],
    ];

    for (const d of DIRS) {
      // Prevent immediate 180-degree turns if snake is longer than 1 segment
      if (
        currentSnakeSegments.length > 1 &&
        d[0] === -currentDirection[0] &&
        d[1] === -currentDirection[1] &&
        d[2] === -currentDirection[2]
      ) {
        continue;
      }

      const newHead: [number, number, number] = [
        (head[0] + d[0] + GRID_SIZE) % GRID_SIZE,
        (head[1] + d[1] + GRID_SIZE) % GRID_SIZE,
        (head[2] + d[2] + GRID_SIZE) % GRID_SIZE,
      ];

      // Check for self-collision
      const collision = currentSnakeSegments.some(
        (segment, index) => index < currentSnakeSegments.length -1 && segment[0] === newHead[0] && segment[1] === newHead[1] && segment[2] === newHead[2]
      );

      if (!collision) {
        const dist = Math.abs(newHead[0] - nodePosition[0]) +
                     Math.abs(newHead[1] - nodePosition[1]) +
                     Math.abs(newHead[2] - nodePosition[2]); // Manhattan distance
        possibleMoves.push({ dir: d, dist, newHead });
      }
    }

    if (possibleMoves.length === 0) {
      // If all moves lead to collision, try to continue in current direction if safe (should be caught by loop above)
      // Or, as a last resort, pick a random valid direction not causing immediate collision (more complex)
      // For now, if truly stuck, maintain current direction (which might lead to game over if it was a bad spot)
      // A more robust AI would have better escape logic.
      const currentDirStillSafeNewHead: [number,number,number] = [
        (head[0] + currentDirection[0] + GRID_SIZE) % GRID_SIZE,
        (head[1] + currentDirection[1] + GRID_SIZE) % GRID_SIZE,
        (head[2] + currentDirection[2] + GRID_SIZE) % GRID_SIZE,
      ];
       const currentDirStillSafeCollision = currentSnakeSegments.some(
        (segment, index) => index < currentSnakeSegments.length -1 && segment[0] === currentDirStillSafeNewHead[0] && segment[1] === currentDirStillSafeNewHead[1] && segment[2] === currentDirStillSafeNewHead[2]
      );
      if(!currentDirStillSafeCollision) return currentDirection;

      // If even current direction is unsafe, this is a tough spot. A real "win" AI would backtrack or use A*.
      // For now, pick any non-180 of the DIRS that isn't immediately fatal.
      for (const d of DIRS) {
          if (currentSnakeSegments.length > 1 && d[0] === -currentDirection[0] && d[1] === -currentDirection[1] && d[2] === -currentDirection[2]) continue;
           const emergencyNewHead: [number, number, number] = [
            (head[0] + d[0] + GRID_SIZE) % GRID_SIZE,
            (head[1] + d[1] + GRID_SIZE) % GRID_SIZE,
            (head[2] + d[2] + GRID_SIZE) % GRID_SIZE,
          ];
          const emergencyCollision = currentSnakeSegments.some(
            (segment, index) => index < currentSnakeSegments.length -1 && segment[0] === emergencyNewHead[0] && segment[1] === emergencyNewHead[1] && segment[2] === emergencyNewHead[2]
          );
          if(!emergencyCollision) return d;
      }
      return currentDirection; // Ultimate fallback
    }

    // Sort moves by distance to the node (ascending)
    possibleMoves.sort((a, b) => a.dist - b.dist);

    return possibleMoves[0].dir; // Choose the safest move that's closest to the node
  };

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current || gameState !== 'playing') {
        if (rendererRef.current && mountRef.current && mountRef.current.contains(rendererRef.current.domElement)) {
            mountRef.current.removeChild(rendererRef.current.domElement);
            rendererRef.current.dispose();
            rendererRef.current = null;
        }
        if(sceneRef.current) {
            while(sceneRef.current.children.length > 0){ 
                sceneRef.current.remove(sceneRef.current.children[0]); 
            }
        }
        return;
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(LEVELS[currentLevel].theme.background, 0.035); 
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio); 
    renderer.shadowMap.enabled = true; 
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const theme = LEVELS[currentLevel].theme;
    const directionalLight = new THREE.DirectionalLight(theme.primary, 0.8);
    directionalLight.position.set(15, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    scene.add(directionalLight);

    const pointLight2 = new THREE.PointLight(theme.secondary, 0.7, 100);
    pointLight2.position.set(-10, -5, -10);
    scene.add(pointLight2);
    
    const gridBoxGeometry = new THREE.BoxGeometry(GRID_SIZE, GRID_SIZE, GRID_SIZE);
    const gridMaterial = new THREE.MeshBasicMaterial({ color: theme.primary, wireframe: true, transparent: true, opacity: 0.2 });
    const gridBox = new THREE.Mesh(gridBoxGeometry, gridMaterial);
    gridBox.position.set(0,0,0); 
    scene.add(gridBox);

    const gridHelper = new THREE.GridHelper(GRID_SIZE, GRID_SIZE, theme.primary, theme.secondary);
    gridHelper.position.y = -GRID_SIZE / 2 + 0.01; 
    gridHelper.material.opacity = 0.3;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    const snakeGroup = new THREE.Group();
    snakeRef.current = snakeGroup;
    scene.add(snakeGroup);

    // Data Node: Increased radius from 0.45 to 0.7 for better visibility and "eatability"
    const nodeRadius = 0.7;
    const nodeGeometry = new THREE.IcosahedronGeometry(nodeRadius, 1); 
    const nodeMaterial = new THREE.MeshStandardMaterial({ color: theme.accent, emissive: theme.accent, emissiveIntensity: 0.8, roughness: 0.2, metalness: 0.1 });
    const dataNode = new THREE.Mesh(nodeGeometry, nodeMaterial);
    dataNode.castShadow = true;
    dataNodeRef.current = dataNode;
    scene.add(dataNode);

    const nodeLight = new THREE.PointLight(theme.accent, 1.5, 5 + nodeRadius * 2); // Adjust light range slightly for larger node
    dataNode.add(nodeLight); 

    // Arrow Indicator: Adjusted y position for larger node
    const arrowGeometry = new THREE.ConeGeometry(0.25, 0.8, 4); // Cone base radius 0.25, height 0.8
    const arrowMaterial = new THREE.MeshBasicMaterial({ color: theme.accent, transparent: true, opacity: 0.7 });
    arrowRef.current = new THREE.Mesh(arrowGeometry, arrowMaterial); // Assign to ref
    dataNode.add(arrowRef.current);
    arrowRef.current.position.y = nodeRadius + 0.2 + (0.8/2);
    arrowRef.current.rotation.x = Math.PI;

    // Mouse controls for camera
    const handleMouseDown = (event: MouseEvent) => {
        setIsMouseDown(true);
        lastMousePositionRef.current = { x: event.clientX, y: event.clientY };
        if (mountRef.current) mountRef.current.style.cursor = 'grabbing';
    };

    const handleMouseUp = () => {
        setIsMouseDown(false);
        lastMousePositionRef.current = null;
        if (mountRef.current) mountRef.current.style.cursor = 'grab';
    };

    const handleMouseMove = (event: MouseEvent) => {
        if (!isMouseDown || !lastMousePositionRef.current) return;

        const deltaX = event.clientX - lastMousePositionRef.current.x;
        const deltaY = event.clientY - lastMousePositionRef.current.y;

        setCameraAzimuthAngle(prev => prev - deltaX * 0.005); 
        setCameraPolarAngle(prev => {
            const newAngle = prev - deltaY * 0.005;
            return Math.max(0.1, Math.min(Math.PI - 0.1, newAngle)); 
        });

        lastMousePositionRef.current = { x: event.clientX, y: event.clientY };
    };

    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp); 
    window.addEventListener('mousemove', handleMouseMove); 


    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      setCameraDistance(prev => {
        const newDistance = prev + event.deltaY * 0.02;
        return Math.max(10, Math.min(50, newDistance)); 
      });
    };

    const handleCameraKeys = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyA': setCameraAzimuthAngle(prev => prev + 0.05); break;
        case 'KeyD': setCameraAzimuthAngle(prev => prev - 0.05); break;
        case 'KeyW': setCameraPolarAngle(prev => Math.max(0.1, Math.min(Math.PI / 2 - 0.1, prev - 0.05))); break;
        case 'KeyS': setCameraPolarAngle(prev => Math.max(0.1, Math.min(Math.PI / 2 - 0.1, prev + 0.05))); break;
      }
    };
    
    window.addEventListener('keydown', handleCameraKeys);
    renderer.domElement.addEventListener('wheel', handleWheel, { passive: false });

    // ANIMATE FUNCTION AND CALL REMOVED FROM THIS useEffect
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      // cancelAnimationFrame(frameRef.current); // CLEANUP FOR ANIMATE REMOVED
      window.removeEventListener('keydown', handleCameraKeys);
      if (rendererRef.current && rendererRef.current.domElement) { // Check if domElement exists
        rendererRef.current.domElement.removeEventListener('mousedown', handleMouseDown);
        rendererRef.current.domElement.removeEventListener('wheel', handleWheel);
      }
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      if (rendererRef.current) {
        if (mountRef.current && mountRef.current.contains(rendererRef.current.domElement)) {
             mountRef.current.removeChild(rendererRef.current.domElement);
        }
        rendererRef.current.dispose();
        rendererRef.current = null; 
      }
      window.removeEventListener('resize', handleResize);
      if (sceneRef.current) {
        while(sceneRef.current.children.length > 0){ 
            const child = sceneRef.current.children[0];
            sceneRef.current.remove(child);
            // Basic geometry/material disposal for direct children
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose();
                if (Array.isArray(child.material)) {
                    child.material.forEach(m => m.dispose());
                } else {
                    child.material.dispose();
                }
            }
        }
      }
      sceneRef.current = null;
      cameraRef.current = null;
      snakeRef.current = null; // This group's children (snake segments) are handled in its own useEffect
      dataNodeRef.current = null;
    };
  }, [gameState, currentLevel]);
// Animation Loop
  useEffect(() => {
    if (gameState !== 'playing' || !rendererRef.current || !sceneRef.current || !cameraRef.current) {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = 0;
      }
      return;
    }

    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const renderer = rendererRef.current;
    const currentDataNode = dataNodeRef.current;
    const currentArrow = arrowRef.current;
    // Define nodeRadius here or ensure it's accessible if defined outside
    const nodeRadius = 0.7; // Assuming this is the same as defined in the setup effect

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      // Update camera position based on state
      camera.position.x = cameraDistance * Math.sin(cameraPolarAngle) * Math.cos(cameraAzimuthAngle);
      camera.position.y = cameraDistance * Math.cos(cameraPolarAngle);
      camera.position.z = cameraDistance * Math.sin(cameraPolarAngle) * Math.sin(cameraAzimuthAngle);
      camera.lookAt(0, 0, 0);

      // Data node animation
      if (currentDataNode) {
        currentDataNode.rotation.y += 0.015;
        currentDataNode.rotation.x += 0.005;
        const pulseScale = 1 + Math.sin(Date.now() * 0.004) * 0.12;
        currentDataNode.scale.set(pulseScale, pulseScale, pulseScale);
        
        if (currentArrow && currentDataNode.children.includes(currentArrow)) {
          currentArrow.position.y = (nodeRadius + 0.2 + (0.8/2)) + Math.sin(Date.now() * 0.006) * 0.15;
        }
      }

      renderer.render(scene, camera);
    };

    if (frameRef.current === 0) { // Start animation only if not already running
        animate();
    }

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = 0;
      }
    };
  }, [
    gameState, 
    cameraDistance, 
    cameraPolarAngle, 
    cameraAzimuthAngle, 
    // Include refs in dependencies if their .current property's stability is crucial for the effect's logic,
    // though typically, changes to .current don't trigger re-runs.
    // Here, their presence is checked at the start, so direct state vars are more important for re-running the effect.
    // nodeRadius is constant here but if it were dynamic state/prop, it would be needed.
  ]);


  // Update snake visuals
  useEffect(() => {
    if (!snakeRef.current || !sceneRef.current || gameState !== 'playing') return;

    while (snakeRef.current.children.length > 0) {
      const child = snakeRef.current.children[0];
      snakeRef.current.remove(child);
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) {
            child.material.forEach(m => m.dispose());
        } else {
            child.material.dispose();
        }
      } else if (child instanceof THREE.Group) { 
          child.traverse(obj => {
              if (obj instanceof THREE.Mesh) {
                  obj.geometry.dispose();
                  if (Array.isArray(obj.material)) {
                      obj.material.forEach(m => m.dispose());
                  } else {
                      obj.material.dispose();
                  }
              }
          });
      }
    }
    
    const theme = LEVELS[currentLevel].theme;

    snakeSegments.forEach((segment, index) => {
      const isHead = index === 0;
      const segmentGroup = new THREE.Group(); 
      
      const worldPos = [
        segment[0] - (GRID_SIZE / 2 - 0.5),
        segment[1] - (GRID_SIZE / 2 - 0.5),
        segment[2] - (GRID_SIZE / 2 - 0.5)
      ];
      segmentGroup.position.set(worldPos[0], worldPos[1], worldPos[2]);

      const geometry = new THREE.BoxGeometry(0.9, 0.9, 0.9); 
      const material = new THREE.MeshStandardMaterial({
        color: isHead ? theme.accent : theme.primary,
        emissive: isHead ? theme.accent : theme.primary,
        emissiveIntensity: isHead ? 0.6 : 0.3 * (1 - index / (snakeSegments.length + 1)), 
        roughness: 0.4,
        metalness: 0.1,
        transparent: !isHead,
        opacity: isHead ? 1 : 0.75 - (index / (snakeSegments.length + 1)) * 0.4
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true; 
      segmentGroup.add(mesh);

      if (isHead) {
        const eyeGeometry = new THREE.SphereGeometry(0.12, 8, 8);
        const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x111111 }); 
        
        const eyeOffset = 0.25;
        const forwardOffset = 0.45; 

        let eye1Pos = new THREE.Vector3();
        let eye2Pos = new THREE.Vector3();

        if (Math.abs(direction[0]) > 0) { 
            eye1Pos.set(0, eyeOffset, direction[0] > 0 ? -eyeOffset : eyeOffset);
            eye2Pos.set(0, -eyeOffset, direction[0] > 0 ? -eyeOffset : eyeOffset);
            mesh.position.set(direction[0] * 0.0, 0, 0); 
        } else if (Math.abs(direction[1]) > 0) { 
            eye1Pos.set(eyeOffset, 0, direction[1] > 0 ? -eyeOffset : eyeOffset);
            eye2Pos.set(-eyeOffset, 0, direction[1] > 0 ? -eyeOffset : eyeOffset);
             mesh.position.set(0, direction[1] * 0.0, 0);
        } else { 
            eye1Pos.set(eyeOffset, eyeOffset, 0);
            eye2Pos.set(-eyeOffset, eyeOffset, 0);
             mesh.position.set(0, 0, direction[2] * 0.0);
        }
        eye1Pos.multiplyScalar(0.8).addScaledVector(new THREE.Vector3(...direction), forwardOffset * 0.8);
        eye2Pos.multiplyScalar(0.8).addScaledVector(new THREE.Vector3(...direction), forwardOffset * 0.8);


        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.copy(eye1Pos);
        segmentGroup.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.copy(eye2Pos);
        segmentGroup.add(rightEye);

        const headLight = new THREE.PointLight(theme.accent, 0.5, 2);
        headLight.position.set(direction[0]*0.5, direction[1]*0.5, direction[2]*0.5);
        segmentGroup.add(headLight);
      }
      snakeRef.current.add(segmentGroup);
    });
  }, [snakeSegments, currentLevel, gameState, direction]); 

  // Update data node position
  useEffect(() => {
    if (!dataNodeRef.current || gameState !== 'playing') return;
    
    const worldPos = [
      dataNodePosition[0] - (GRID_SIZE / 2 - 0.5),
      dataNodePosition[1] - (GRID_SIZE / 2 - 0.5),
      dataNodePosition[2] - (GRID_SIZE / 2 - 0.5)
    ];
    dataNodeRef.current.position.set(worldPos[0], worldPos[1], worldPos[2]);
  }, [dataNodePosition, gameState]);

  // Handle keyboard controls for snake
  useEffect(() => {
    if (gameState !== 'playing' || isAiModeActive) return; // Ignore player input if AI is active

    const handleKeyPress = (event: KeyboardEvent) => {
      if (['KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(event.code) && !isMouseDown) {
          return; 
      }

      const currentDir = direction;
      let newDir: [number, number, number] | null = null;

      switch (event.code) {
        case 'ArrowUp': 
          if (currentDir[1] !== -1) newDir = [0, 1, 0];
          break;
        case 'ArrowDown': 
          if (currentDir[1] !== 1) newDir = [0, -1, 0];
          break;
        case 'ArrowLeft': 
          if (currentDir[0] === 1) newDir = [0, 0, -1]; 
          else if (currentDir[0] === -1) newDir = [0, 0, 1]; 
          else if (currentDir[2] === 1) newDir = [1, 0, 0];  
          else if (currentDir[2] === -1) newDir = [-1, 0, 0]; 
          else if (currentDir[1] !== 0 && currentDir[0] !== -1) newDir = [-1,0,0]; 
          break;
        case 'ArrowRight': 
          if (currentDir[0] === 1) newDir = [0, 0, 1];  
          else if (currentDir[0] === -1) newDir = [0, 0, -1]; 
          else if (currentDir[2] === 1) newDir = [-1, 0, 0]; 
          else if (currentDir[2] === -1) newDir = [1, 0, 0];  
          else if (currentDir[1] !== 0 && currentDir[0] !== 1) newDir = [1,0,0]; 
          break;
        case 'Space': 
          event.preventDefault();
          const head = snakeSegments[0];
          const targetDir = getDirectionTowardsNode(head, dataNodePosition);
          if (snakeSegments.length <= 1 || (targetDir[0] !== -currentDir[0] || targetDir[1] !== -currentDir[1] || targetDir[2] !== -currentDir[2])) {
            newDir = targetDir;
          }
          break;
      }
      if (newDir) {
        if (snakeSegments.length > 1 &&
            newDir[0] === -currentDir[0] &&
            newDir[1] === -currentDir[1] &&
            newDir[2] === -currentDir[2]) {
        } else {
            setDirection(newDir);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
}, [gameState, direction, snakeSegments, dataNodePosition, isMouseDown, isAiModeActive]);

  // Snake movement loop & AI control
  useEffect(() => {
    if (gameState !== 'playing') return () => {};

    let moveInterval: NodeJS.Timeout;

    if (isAiModeActive) {
      // AI controls the snake
      const aiMove = () => {
        const newDirection = getAiDirection(snakeSegments, dataNodePosition, direction);
        setDirection(newDirection); // Update direction based on AI
        // moveSnake logic will use this new direction in the next segment update cycle
      };
      // AI makes a decision slightly before the snake moves
      // This interval should ideally be synchronized with moveSnake or integrated within it.
      // For now, let AI decide direction, then moveSnake will execute with that direction.
      // This could be refined to make AI decisions part of the setSnakeSegments update.
      aiMove(); // Decide direction immediately when AI is turned on or before next move
      moveInterval = setInterval(() => {
        // AI recalculates best move before each actual move
        const nextAiDir = getAiDirection(snakeSegments, dataNodePosition, direction);
        setDirection(nextAiDir);
        // The actual move is triggered by the setSnakeSegments in the main moveSnake function
        // This is a bit indirect; ideally, AI would directly call a modified moveSnake or setSnakeSegments
      }, LEVELS[currentLevel].speed - 10); // AI thinks a bit faster
    }

    const moveSnake = () => {
      setSnakeSegments(prevSegments => {
        // If AI mode is active, the direction state should have been updated by the AI's useEffect.
        // If not, it's player-controlled direction.
        const newSegments = prevSegments.map(arr => [...arr] as [number,number,number]); 
        const head = newSegments[0];
        const newHead: [number, number, number] = [
          head[0] + direction[0],
          head[1] + direction[1],
          head[2] + direction[2]
        ];

        newHead[0] = (newHead[0] + GRID_SIZE) % GRID_SIZE;
        newHead[1] = (newHead[1] + GRID_SIZE) % GRID_SIZE;
        newHead[2] = (newHead[2] + GRID_SIZE) % GRID_SIZE;

        const collisionSegments = newSegments.length > 1 ? newSegments.slice(0, -1) : newSegments;
        if (collisionSegments.some(segment =>
          segment[0] === newHead[0] &&
          segment[1] === newHead[1] &&
          segment[2] === newHead[2]
        )) {
          handleGameOver();
          return prevSegments; 
        }

        newSegments.unshift(newHead); 

        if (dataNodePosition &&
            newHead[0] === dataNodePosition[0] &&
            newHead[1] === dataNodePosition[1] &&
            newHead[2] === dataNodePosition[2]) {
          handleDataNodeCollected();
        } else {
          newSegments.pop(); 
        }
        return newSegments;
      });
    };

    const gameSpeed = LEVELS[currentLevel].speed;
    const mainMoveInterval = setInterval(moveSnake, gameSpeed);
    
    return () => {
      clearInterval(mainMoveInterval);
      if (moveInterval) clearInterval(moveInterval); // Clear AI's interval if it exists
    };
  }, [gameState, direction, dataNodePosition, currentLevel, snakeSegments, isAiModeActive]);

  // Handle data node collection
  const handleDataNodeCollected = () => {
    const newScore = score + 1;
    setScore(newScore);
    setTotalNodesCollected(prev => prev + 1);
    
    if (newScore >= LEVELS[currentLevel].requiredNodes) {
      setGameState('levelComplete');
    } else {
      setDataNodePosition(getRandomPosition(snakeSegments));
    }
  };

  // Handle game over
  const handleGameOver = () => {
    setGameState('gameover');
  };

  // Start/restart level
  const startLevel = (levelIndex = currentLevel) => {
    setCurrentLevel(levelIndex);
    setScore(0);
    const initialSnakePos: [number, number, number] = [Math.floor(GRID_SIZE/2), Math.floor(GRID_SIZE/2), Math.floor(GRID_SIZE/2)];
    setSnakeSegments([initialSnakePos, [initialSnakePos[0]-1, initialSnakePos[1], initialSnakePos[2]]]); 
    setDirection([1, 0, 0]); 
    setDataNodePosition(getRandomPosition([initialSnakePos]));
    setGameState('lesson');
    setAiHintShownThisLevel(false); // Reset hint shown flag for the new level
  };

  // Next level
  const nextLevel = () => {
    if (currentLevel < LEVELS.length - 1) {
      startLevel(currentLevel + 1);
    } else {
      setGameState('victory'); 
    }
  };
  
  // Reset current level
  const resetLevel = () => {
    startLevel(currentLevel);
  };

  // Reset game
  const resetGame = () => {
    setTotalNodesCollected(0);
    setAiButtonEverClicked(false); // Reset this for a full game restart
    // startLevel(0) will call setAiHintShownThisLevel(false)
    startLevel(0);
  };

  // Handle Enter key for screen advancement
  useEffect(() => {
    const handleScreenAdvanceKey = (event: KeyboardEvent) => {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        event.preventDefault();
        if (gameState === 'intro') startLevel(0);
        else if (gameState === 'lesson') setGameState('playing');
        else if (gameState === 'levelComplete') nextLevel();
        else if (gameState === 'gameover') resetLevel();
        else if (gameState === 'victory') resetGame();
      }
    };
    window.addEventListener('keydown', handleScreenAdvanceKey);
    return () => window.removeEventListener('keydown', handleScreenAdvanceKey);
  }, [gameState, currentLevel]);

  // AI Hint Popup Logic
  useEffect(() => {
    let hintTimer: NodeJS.Timeout;
    if (gameState === 'playing' && !isAiModeActive && !aiHintShownThisLevel && !aiButtonEverClicked) {
      hintTimer = setTimeout(() => {
        setShowAiHintPopup(true);
      }, 20000); // Show hint after 20 seconds of playing without AI interaction
    }
    return () => clearTimeout(hintTimer);
  }, [gameState, isAiModeActive, aiHintShownThisLevel, aiButtonEverClicked]);

  // Track if AI button was ever clicked to suppress future hints for the session
  useEffect(() => {
    if (isAiModeActive && !aiButtonEverClicked) {
      setAiButtonEverClicked(true);
      setShowAiHintPopup(false); // Hide hint if it was shown and then AI button was clicked
    }
  }, [isAiModeActive, aiButtonEverClicked]);

  const currentTheme = LEVELS[currentLevel].theme;

  const animationStyles = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translate(-50%, -45%); }
      to { opacity: 1; transform: translate(-50%, -50%); }
    }
    @keyframes popIn {
      0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
      80% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
      100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
    body { margin: 0; background-color: #0A0A0F; color: white; font-family: 'Orbitron', sans-serif; }
    button:hover { filter: brightness(1.2); transform: scale(1.05); }
    button:active { filter: brightness(0.9); transform: scale(0.98); }
  `;

  return (
    <>
      <style>{animationStyles}</style>
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet" />
      <div style={{
        position: 'relative',
        height: '100vh',
        width: '100vw',
        background: `radial-gradient(ellipse at center, ${currentTheme.background} 30%, #030305 100%)`,
        fontFamily: "'Orbitron', sans-serif",
        overflow: 'hidden',
        color: 'white'
      }}>
        {gameState === 'playing' && (
          <>
            <GameHUD
              score={score}
              level={currentLevel}
              nodesNeeded={LEVELS[currentLevel].requiredNodes}
            />
            <div style={{
              position: 'absolute',
              bottom: 15,
              left: 15,
              color: 'rgba(255,255,255,0.8)',
              fontSize: '13px',
              background: 'rgba(0,0,0,0.7)',
              padding: '8px 12px',
              borderRadius: '6px',
              border: `1px solid ${currentTheme.primary}88`,
              zIndex: 90
            }}>
              <strong>Controls:</strong> Arrows: Move | Space: Auto-Aim | WASD/Mouse Drag: Camera | Scroll: Zoom
            </div>
            <button
              onClick={() => setIsAiModeActive(prev => !prev)}
              style={{
                position: 'absolute',
                bottom: 15,
                right: 15,
                padding: '10px 15px',
                fontSize: '14px',
                backgroundColor: isAiModeActive ? currentTheme.accent : currentTheme.primary,
                color: currentTheme.background,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                zIndex: 100,
                boxShadow: `0 0 10px ${isAiModeActive ? currentTheme.accent : currentTheme.primary}77`
              }}
            >
              {isAiModeActive ? 'AI Active (Disable)' : 'Enable AI Win'}
            </button>
            <div ref={mountRef} style={{ width: '100%', height: '100%', cursor: isMouseDown ? 'grabbing' : 'grab' }} />
          </>
        )}

        {showAiHintPopup && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white', textAlign: 'center', zIndex: 200, // Higher zIndex
            background: 'rgba(20, 20, 40, 0.98)', padding: '30px 40px', borderRadius: '15px',
            border: `2px solid ${currentTheme.accent}`, boxShadow: `0 0 20px ${currentTheme.accent}66`,
            maxWidth: '450px', animation: 'fadeIn 0.5s ease-out'
          }}>
            <h3 style={{ fontSize: '1.8rem', color: currentTheme.accent, marginBottom: '15px' }}>
              AI Assistant Tip!
            </h3>
            <p style={{ fontSize: '1.1rem', marginBottom: '25px', lineHeight: '1.6', color: '#eee' }}>
              Stuck? Try the "Enable AI Win" button! It can guide the snake to the data node. You can toggle it on or off.
            </p>
            <button
              onClick={() => {
                setShowAiHintPopup(false);
                setAiHintShownThisLevel(true);
              }}
              style={{
                fontSize: '1.2rem', padding: '10px 20px', background: currentTheme.accent,
                border: 'none', borderRadius: '8px', color: currentTheme.background, fontWeight: 'bold',
                cursor: 'pointer', boxShadow: `0 4px 15px ${currentTheme.accent}55`, transition: 'all 0.2s ease'
              }}
            >
              Got it!
            </button>
          </div>
        )}

        {gameState === 'intro' && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            color: 'white', textAlign: 'center', zIndex: 10,
            background: 'rgba(10, 10, 20, 0.97)', padding: '40px 50px', borderRadius: '25px',
            border: `3px solid ${LEVELS[0].theme.primary}`, boxShadow: `0 0 30px ${LEVELS[0].theme.primary}77`,
            maxWidth: '650px', animation: 'popIn 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}>
            <h1 style={{
              fontSize: '3.8rem', color: LEVELS[0].theme.primary, marginBottom: '25px',
              textShadow: `0 0 15px ${LEVELS[0].theme.primary}, 0 0 25px ${LEVELS[0].theme.primary}`
            }}>
              CODE SNAKE 3D
            </h1>
            <p style={{ fontSize: '1.3rem', marginBottom: '25px', lineHeight: '1.7', color: '#eee' }}>
              Navigate a 3D snake, collect data nodes, and learn programming concepts across 5 challenging levels!
            </p>
            <div style={{
              fontSize: '1.1rem', background: 'rgba(0, 212, 255, 0.08)', padding: '15px 20px',
              borderRadius: '10px', marginBottom: '30px', textAlign: 'left', border: `1px solid ${LEVELS[0].theme.primary}55`
            }}>
              <strong>🎮 Controls:</strong><br />
              • Arrow Keys: Turn snake / Change vertical layer<br />
              • Spacebar: Auto-aim towards the current data node<br />
              <strong>📷 Camera:</strong><br/>
              • WASD Keys / Mouse Click & Drag: Rotate & Tilt camera<br/>
              • Mouse Scroll: Zoom In / Out
            </div>
            <button
              onClick={() => startLevel(0)}
              style={{
                fontSize: '1.7rem', padding: '18px 35px', background: LEVELS[0].theme.primary,
                border: 'none', borderRadius: '12px', color: LEVELS[0].theme.background, fontWeight: 'bold',
                cursor: 'pointer', boxShadow: `0 5px 25px ${LEVELS[0].theme.primary}77`, transition: 'all 0.2s ease'
              }}
            >
              Start Learning!
            </button>
            <p style={{ marginTop: '20px', opacity: 0.7, fontSize: '0.9rem' }}>Press ENTER to Begin</p>
          </div>
        )}

        {gameState === 'lesson' && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            color: 'white', textAlign: 'center', zIndex: 10,
            background: 'rgba(10, 10, 20, 0.97)', padding: '40px', borderRadius: '20px',
            border: `3px solid ${currentTheme.primary}`, boxShadow: `0 0 25px ${currentTheme.primary}55`,
            maxWidth: '600px', animation: 'fadeIn 0.5s ease-out', transform: 'translate(-50%, -50%)'
          }}>
            <h2 style={{ fontSize: '2.8rem', color: currentTheme.primary, marginBottom: '25px', textShadow: `0 0 10px ${currentTheme.primary}` }}>
              {LEVELS[currentLevel].lesson.title}
            </h2>
            <p style={{ fontSize: '1.25rem', marginBottom: '30px', lineHeight: '1.8', whiteSpace: 'pre-line', color: '#ddd' }}>
              {LEVELS[currentLevel].lesson.content}
            </p>
            <button
              onClick={() => setGameState('playing')}
              style={{
                fontSize: '1.6rem', padding: '15px 30px', background: currentTheme.primary,
                border: 'none', borderRadius: '10px', color: currentTheme.background, fontWeight: 'bold',
                cursor: 'pointer', boxShadow: `0 4px 20px ${currentTheme.primary}66`, transition: 'all 0.2s ease'
              }}
            >
              Let's Code! (Enter)
            </button>
          </div>
        )}

        {gameState === 'levelComplete' && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            color: 'white', textAlign: 'center', zIndex: 10,
            background: 'rgba(10, 20, 10, 0.97)', padding: '50px', borderRadius: '20px',
            border: `3px solid ${currentTheme.accent}`, boxShadow: `0 0 30px ${currentTheme.accent}77`,
            maxWidth: '550px', animation: 'popIn 0.6s ease-out', transform: 'translate(-50%, -50%)'
          }}>
            <h2 style={{ fontSize: '3rem', color: currentTheme.accent, marginBottom: '25px', textShadow: `0 0 15px ${currentTheme.accent}` }}>
              Level {currentLevel + 1} Complete! 🎉
            </h2>
            <p style={{ fontSize: '1.4rem', marginBottom: '30px', color: '#eee' }}>
              Excellent! You've mastered the concepts of {LEVELS[currentLevel].name}.
            </p>
            <button
              onClick={nextLevel}
              style={{
                fontSize: '1.6rem', padding: '15px 30px', background: currentTheme.accent,
                border: 'none', borderRadius: '10px', color: currentTheme.background, fontWeight: 'bold',
                cursor: 'pointer', boxShadow: `0 4px 20px ${currentTheme.accent}66`, transition: 'all 0.2s ease'
              }}
            >
              {currentLevel < LEVELS.length - 1 ? `Next Level (Enter)` : `Finish Game (Enter)`}
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            color: 'white', textAlign: 'center', zIndex: 10,
            background: 'rgba(20, 10, 10, 0.97)', padding: '50px', borderRadius: '20px',
            border: '3px solid #ff4444', boxShadow: '0 0 30px #ff444477',
            maxWidth: '550px', animation: 'fadeIn 0.5s ease-out', transform: 'translate(-50%, -50%)'
          }}>
            <h2 style={{ fontSize: '2.8rem', color: '#ff6666', marginBottom: '20px', textShadow: '0 0 10px #ff4444' }}>
              Game Over!
            </h2>
            <p style={{ fontSize: '1.3rem', marginBottom: '30px', color: '#ddd' }}>
              Don't worry, debugging is part of coding! Give it another try.
            </p>
            <button
              onClick={resetLevel}
              style={{
                fontSize: '1.5rem', padding: '15px 30px', background: '#ff5555',
                border: 'none', borderRadius: '10px', color: 'white', fontWeight: 'bold',
                cursor: 'pointer', marginRight: '20px', boxShadow: '0 4px 15px #ff444466', transition: 'all 0.2s ease'
              }}
            >
              Retry Level (Enter)
            </button>
            <button
              onClick={resetGame}
              style={{
                fontSize: '1.5rem', padding: '15px 30px', background: '#777',
                border: 'none', borderRadius: '10px', color: 'white', fontWeight: 'bold',
                cursor: 'pointer', boxShadow: '0 4px 15px #77777766', transition: 'all 0.2s ease'
              }}
            >
              Main Menu
            </button>
          </div>
        )}

        {gameState === 'victory' && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            color: 'white', textAlign: 'center', zIndex: 10,
            background: 'rgba(10, 10, 30, 0.97)', padding: '60px', borderRadius: '25px',
            border: `3px solid ${LEVELS[LEVELS.length-1].theme.accent}`, boxShadow: `0 0 40px ${LEVELS[LEVELS.length-1].theme.accent}99`,
            maxWidth: '600px', animation: 'popIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)', transform: 'translate(-50%, -50%)'
          }}>
            <h2 style={{ fontSize: '3.5rem', color: LEVELS[LEVELS.length-1].theme.accent, marginBottom: '30px', textShadow: `0 0 20px ${LEVELS[LEVELS.length-1].theme.accent}` }}>
              Congratulations! 🏆
            </h2>
            <p style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#eee' }}>
              You've successfully completed all levels of Code Snake 3D!
            </p>
            <p style={{ fontSize: '1.2rem', marginBottom: '35px', color: '#ccc' }}>
              Total Data Nodes Collected: {totalNodesCollected}
            </p>
            <button
              onClick={resetGame}
              style={{
                fontSize: '1.7rem', padding: '18px 35px', background: LEVELS[LEVELS.length-1].theme.accent,
                border: 'none', borderRadius: '12px', color: LEVELS[LEVELS.length-1].theme.background, fontWeight: 'bold',
                cursor: 'pointer', boxShadow: `0 5px 25px ${LEVELS[LEVELS.length-1].theme.accent}77`, transition: 'all 0.2s ease'
              }}
            >
              Play Again (Enter)
            </button>
          </div>
        )}

      </div>
    </>
  );
}

export default App;