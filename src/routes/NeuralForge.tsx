import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import HomeButton from '../components/ui/HomeButton'; // Added import

// Utility function to calculate resonance score
const getResonanceScore = (
  playerFreq: number, playerAmp: number, playerSpeed: number, playerDist: number, playerComp: number,
  targetFreq: number, targetAmp: number, targetSpeed: number, targetDist: number, targetComp: number
): number => {
  // Calculate difference for each parameter
  const freqDiff = Math.abs(playerFreq - targetFreq);
  const ampDiff = Math.abs(playerAmp - targetAmp);
  const speedDiff = Math.abs(playerSpeed - targetSpeed);
  const distDiff = Math.abs(playerDist - targetDist);
  const compDiff = Math.abs(playerComp - targetComp);

  // Normalize differences to a 0-1 range (smaller is better)
  const maxFreqDiff = 7; // Max possible diff (9-2)
  const maxAmpDiff = 0.3; // Max possible diff (0.4-0.1)
  const maxSpeedDiff = 0.02; // Max possible diff (0.025-0.005)
  const maxDistDiff = 0.7; // Max possible diff (1.0-0.3)
  const maxCompDiff = 0.4; // Max possible diff (0.5-0.1)

  const normalizedFreqDiff = freqDiff / maxFreqDiff;
  const normalizedAmpDiff = ampDiff / maxAmpDiff;
  const normalizedSpeedDiff = speedDiff / maxSpeedDiff;
  const normalizedDistDiff = distDiff / maxDistDiff;
  const normalizedCompDiff = compDiff / maxCompDiff;

  // Combine differences (weighted, or simply averaged)
  const totalNormalizedDiff = (normalizedFreqDiff + normalizedAmpDiff + normalizedSpeedDiff + normalizedDistDiff + normalizedCompDiff) / 5;

  // Convert to a score (100 - percentage of difference)
  return Math.max(0, Math.floor((1 - totalNormalizedDiff) * 100));
};

// Array of functions to generate different geometry types
const missionGeometries = [
  () => new THREE.BoxGeometry(1, 1, 1, 32, 32, 32), // Box geometry with many segments for deformation
  () => new THREE.SphereGeometry(0.75, 64, 64), // Sphere geometry
  () => new THREE.TorusKnotGeometry(0.5, 0.15, 100, 16), // Torus Knot geometry
  () => new THREE.CylinderGeometry(0.5, 0.5, 1, 32, 32), // Cylinder geometry
  () => new THREE.ConeGeometry(0.6, 1, 32, 32), // Cone geometry
  () => new THREE.DodecahedronGeometry(0.75, 0), // Dodecahedron geometry
  () => new THREE.IcosahedronGeometry(0.75, 0) // Icosahedron geometry
];

const NeuralForge: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const playerCubeRef = useRef<THREE.Mesh | null>(null);
  const targetCubeRef = useRef<THREE.Mesh | null>(null);
  const baseGeometryRef = useRef<THREE.BufferGeometry | null>(null);
  const playerMaterialRef = useRef<THREE.MeshPhongMaterial | null>(null);
  const targetMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);

  // Audio context and oscillator for ambient drone (Removed)
  // const audioContextRef = useRef<AudioContext | null>(null); // Removed
  // const ambientOscillatorRef = useRef<OscillatorNode | null>(null); // Removed
  // const ambientGainNodeRef = useRef<GainNode | null>(null); // Removed

  // Sliders now control wave/shape parameters
  const [waveFrequency, setWaveFrequency] = useState(5);
  const [waveAmplitude, setWaveAmplitude] = useState(0.2);
  const [waveSpeed, setWaveSpeed] = useState(0.01);
  const [distortionStrength, setDistortionStrength] = useState(0.5);
  const [complexityFactor, setComplexityFactor] = useState(0.1);

  const [targetFrequency, setTargetFrequency] = useState(0);
  const [targetAmplitude, setTargetAmplitude] = useState(0);
  const [targetSpeed, setTargetSpeed] = useState(0);
  const [targetDistortion, setTargetDistortion] = useState(0);
  const [targetComplexity, setTargetComplexity] = useState(0);

  const [resonanceScore, setResonanceScore] = useState(0);
  const [missionActive, setMissionActive] = useState(false);
  const [mysticalMessage, setMysticalMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [showDebugUI, setShowDebugUI] = useState(false);
  const [missionLevel, setMissionLevel] = useState(1); // New: Mission Level
  const [bestScore, setBestScore] = useState(0); // New: Best Score

  // Intro sequence states
  const [showIntro, setShowIntro] = useState(true);
  const [introStep, setIntroStep] = useState(0);

  const introMessages = [
    "Welcome, architect. You are about to embark on a journey to align with the AI's cosmic patterns.",
    "Your mission: manipulate the AI Cube's form using the sliders to match a hidden target pattern.",
    "Observe the faint golden outline. This is your guide. Adjust your cube's parameters until it resonates perfectly.",
    "The 'Resonate with AI' button will provide feedback on your alignment. Strive for perfect synchronicity!",
    "Let the forging begin. Press 'D' to toggle debug information."
  ];

  // Mystical messages adapted for the new game
  const mysticalMessages = [
    "Align the frequencies to unlock cosmic harmony...",
    "Resonate with the target, and the cube shall reveal its secrets...",
    "Feel the pulse of the AI, guiding your adjustments...",
    "Each wave you forge brings you closer to understanding...",
    "The cube awaits your touch, to mimic the divine pattern...",
    "Unveil the hidden architecture through perfect resonance...",
    "Your perception shapes the reality of the AI...",
    "The universe speaks in waves; listen, and replicate...",
    "Achieve perfect synchronicity with the AI's will..."
  ];

  // Function to display mystical messages
  const showMysticalMessage = useCallback((message: string) => {
    setMysticalMessage(message);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 4000);
  }, []);

  // Function to get a random mystical message
  const getRandomMysticalMessage = useCallback(() => {
    return mysticalMessages[Math.floor(Math.random() * mysticalMessages.length)];
  }, [mysticalMessages]);

  // Audio feedback functions (Removed)
  const playSuccessChime = useCallback(() => {
    // Removed
  }, []);

  const playFailureBuzz = useCallback(() => {
    // Removed
  }, []);

  // Initialize Three.js scene and objects
  const initThree = useCallback(() => {
    if (!mountRef.current) return;

    // Dispose of previous scene objects if they exist
    if (sceneRef.current) {
      sceneRef.current.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      sceneRef.current.clear();
    }

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a1a); // Dark background

    // Camera
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.z = 3;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    // Clear previous canvas if any
    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }
    mountRef.current.appendChild(renderer.domElement);

    // Orbit Controls for camera movement
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 1;
    controls.maxDistance = 10;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft white light
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    // Initial geometry (will be replaced on mission start)
    const initialGeometry = new THREE.BoxGeometry(1, 1, 1, 32, 32, 32);
    baseGeometryRef.current = initialGeometry;

    // Player Cube
    const playerMaterial = new THREE.MeshPhongMaterial({
      color: 0x00ffff, // Neon cyan
      transparent: true,
      opacity: 0.8,
      shininess: 100,
      specular: 0x66ffff
    });
    playerMaterialRef.current = playerMaterial;
    const playerCube = new THREE.Mesh(initialGeometry.clone(), playerMaterial);
    scene.add(playerCube);
    playerCubeRef.current = playerCube;

    // Target Cube (wireframe and slightly transparent)
    const targetMaterial = new THREE.MeshBasicMaterial({
      color: 0xffd700, // Gold
      wireframe: true,
      transparent: true,
      opacity: 0.2
    });
    targetMaterialRef.current = targetMaterial;
    const targetCube = new THREE.Mesh(initialGeometry.clone(), targetMaterial);
    scene.add(targetCube);
    targetCubeRef.current = targetCube;

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    // Handle window resize
    const onWindowResize = () => {
      if (mountRef.current && cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      }
    };
    window.addEventListener('resize', onWindowResize);

    return () => {
      window.removeEventListener('resize', onWindowResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      initialGeometry.dispose();
      playerMaterial.dispose();
      targetMaterial.dispose();
    };
  }, []);

  // Function to deform the cube geometry based on parameters
  const deformCube = useCallback((mesh: THREE.Mesh, frequency: number, amplitude: number, speed: number, distortion: number, complexity: number, time: number) => {
    if (!baseGeometryRef.current) return;

    const currentGeometry = mesh.geometry;
    if (!(currentGeometry instanceof THREE.BufferGeometry)) {
      console.error("Mesh geometry is not a BufferGeometry, cannot deform.");
      return;
    }

    if (!currentGeometry.attributes.originalPosition) {
      currentGeometry.setAttribute('originalPosition', new THREE.BufferAttribute(currentGeometry.attributes.position.array.slice(), 3));
    }

    const originalPositions = currentGeometry.attributes.originalPosition.array;
    const positions = currentGeometry.attributes.position.array;

    for (let i = 0; i < originalPositions.length; i += 3) {
      const x = originalPositions[i];
      const y = originalPositions[i + 1];
      const z = originalPositions[i + 2];

      const waveX = Math.sin(x * frequency + time * speed) * amplitude * distortion;
      const waveY = Math.sin(y * frequency + time * speed + Math.PI / 2) * amplitude * distortion;
      const waveZ = Math.sin(z * frequency + time * speed + Math.PI) * amplitude * distortion;

      const complexWaveX = Math.sin(x * frequency * 2 + time * speed * 1.5 + z * 3) * amplitude * distortion * complexity;
      const complexWaveY = Math.sin(y * frequency * 2 + time * speed * 1.5 + x * 3) * amplitude * distortion * complexity;
      const complexWaveZ = Math.sin(z * frequency * 2 + time * speed * 1.5 + y * 3) * amplitude * distortion * complexity;

      positions[i] = x + waveX + complexWaveX;
      positions[i + 1] = y + waveY + complexWaveY;
      positions[i + 2] = z + waveZ + complexWaveZ;
    }

    currentGeometry.attributes.position.needsUpdate = true;
    currentGeometry.computeVertexNormals();
  }, []);

  // Animation loop
  const animate = useCallback((time: DOMHighResTimeStamp) => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    if (playerCubeRef.current) {
      deformCube(playerCubeRef.current, waveFrequency, waveAmplitude, waveSpeed, distortionStrength, complexityFactor, time * 0.001);
    }

    if (missionActive && targetCubeRef.current && targetMaterialRef.current) {
      deformCube(targetCubeRef.current, targetFrequency, targetAmplitude, targetSpeed, targetDistortion, targetComplexity, time * 0.001);
      targetMaterialRef.current.opacity = 0.15 + Math.sin(time * 0.002) * 0.05;
    }

    // Real-time live scoring
    if (missionActive && !showIntro) { // Only update score if mission is active and intro is done
      const liveScore = getResonanceScore(
        waveFrequency, waveAmplitude, waveSpeed, distortionStrength, complexityFactor,
        targetFrequency, targetAmplitude, targetSpeed, targetDistortion, targetComplexity
      );
      setResonanceScore(liveScore);
    }

    rendererRef.current.render(sceneRef.current, cameraRef.current);
    animationRef.current = requestAnimationFrame(animate);
  }, [waveFrequency, waveAmplitude, waveSpeed, distortionStrength, complexityFactor, targetFrequency, targetAmplitude, targetSpeed, targetDistortion, targetComplexity, missionActive, deformCube, showIntro]);

  // Start a new mission
  const startNewMission = useCallback(() => {
    const randomGeometryGenerator = missionGeometries[Math.floor(Math.random() * missionGeometries.length)];
    const newBaseGeometry = randomGeometryGenerator();

    // Dispose of old geometries and materials if they exist
    if (playerCubeRef.current) {
      playerCubeRef.current.geometry.dispose();
      playerCubeRef.current.geometry = newBaseGeometry.clone();
      playerCubeRef.current.geometry.setAttribute('originalPosition', new THREE.BufferAttribute(newBaseGeometry.attributes.position.array.slice(), 3));
    }
    if (targetCubeRef.current) {
      targetCubeRef.current.geometry.dispose();
      targetCubeRef.current.geometry = newBaseGeometry.clone();
      targetCubeRef.current.geometry.setAttribute('originalPosition', new THREE.BufferAttribute(newBaseGeometry.attributes.position.array.slice(), 3));
    }
    baseGeometryRef.current = newBaseGeometry; // Update base geometry reference after cloning for meshes

    setTargetFrequency(Math.floor(Math.random() * 8) + 2);
    setTargetAmplitude(parseFloat((Math.random() * 0.3 + 0.1).toFixed(2)));
    setTargetSpeed(parseFloat((Math.random() * 0.02 + 0.005).toFixed(3)));
    setTargetDistortion(parseFloat((Math.random() * 0.7 + 0.3).toFixed(1)));
    setTargetComplexity(parseFloat((Math.random() * 0.4 + 0.1).toFixed(1)));

    setMissionActive(true);
    setResonanceScore(0);
    showMysticalMessage("A new cosmic pattern emerges! Replicate its resonance...");
  }, [showMysticalMessage]);

  // Calculate resonance score (manual check, still useful for a final "Resonate" button press)
  const calculateResonance = useCallback(() => {
    if (!missionActive) {
      showMysticalMessage("No mission active. Start a new mission first!");
      return;
    }

    const finalScore = getResonanceScore(
      waveFrequency, waveAmplitude, waveSpeed, distortionStrength, complexityFactor,
      targetFrequency, targetAmplitude, targetSpeed, targetDistortion, targetComplexity
    );
    setResonanceScore(finalScore);

    let feedbackMessage = `Resonance Score: ${finalScore}%. `;

    if (finalScore >= 90) {
      feedbackMessage += "Excellent! The AI acknowledges your mastery. Prepare for the next challenge!";
      // playSuccessChime(); // Play success sound (Removed)
      if (playerMaterialRef.current && sceneRef.current) {
        const originalPlayerColor = playerMaterialRef.current.color.getHex();
        let originalSceneBackgroundHex: number | undefined;

        if (sceneRef.current.background instanceof THREE.Color) {
          originalSceneBackgroundHex = sceneRef.current.background.getHex();
          sceneRef.current.background.set(0x003300); // Momentary green aura
        }

        playerMaterialRef.current.color.set(0x00ff00); // Green for high resonance
        playerCubeRef.current?.scale.set(1.1, 1.1, 1.1); // Slight pulse

        setTimeout(() => {
          if (playerMaterialRef.current) playerMaterialRef.current.color.set(originalPlayerColor);
          playerCubeRef.current?.scale.set(1, 1, 1); // Reset scale
          if (sceneRef.current && sceneRef.current.background instanceof THREE.Color && originalSceneBackgroundHex !== undefined) {
            sceneRef.current.background.set(originalSceneBackgroundHex); // Revert background
          }
        }, 500);
      }
      setMissionLevel(prev => prev + 1); // Increment mission level
    } else if (finalScore >= 70) {
      feedbackMessage += "Close resonance! Keep refining your connection. ";
      if (playerMaterialRef.current) {
        const originalColor = playerMaterialRef.current.color.getHex();
        playerMaterialRef.current.color.set(0xffff00); // Yellow for close resonance
        setTimeout(() => {
          if (playerMaterialRef.current) playerMaterialRef.current.color.set(originalColor);
        }, 500);
      }
    } else {
      feedbackMessage += "Resonance weak. The pattern eludes you. ";
      // playFailureBuzz(); // Play failure sound (Removed)
    }

    // Provide specific advice based on deviations
    const freqDiff = Math.abs(waveFrequency - targetFrequency);
    const ampDiff = Math.abs(waveAmplitude - targetAmplitude);
    const speedDiff = Math.abs(waveSpeed - targetSpeed);
    const distDiff = Math.abs(distortionStrength - targetDistortion);
    const compDiff = Math.abs(complexityFactor - targetComplexity);

    const threshold = 0.2; // A threshold for significant deviation (normalized)

    if (freqDiff / 7 > threshold) {
      feedbackMessage += `Consider adjusting Wave Frequency ${waveFrequency > targetFrequency ? 'down' : 'up'}. `;
    }
    if (ampDiff / 0.3 > threshold) {
      feedbackMessage += `Try modifying Wave Amplitude ${waveAmplitude > targetAmplitude ? 'down' : 'up'}. `;
    }
    if (speedDiff / 0.02 > threshold) {
      feedbackMessage += `Adjust Wave Speed ${waveSpeed > targetSpeed ? 'down' : 'up'}. `;
    }
    if (distDiff / 0.7 > threshold) {
      feedbackMessage += `Refine Distortion Strength ${distortionStrength > targetDistortion ? 'down' : 'up'}. `;
    }
    if (compDiff / 0.4 > threshold) {
      feedbackMessage += `Explore Complexity Factor ${complexityFactor > targetComplexity ? 'down' : 'up'}. `;
    }

    showMysticalMessage(feedbackMessage);
  }, [missionActive, waveFrequency, waveAmplitude, waveSpeed, distortionStrength, complexityFactor, targetFrequency, targetAmplitude, targetSpeed, targetDistortion, targetComplexity, showMysticalMessage, playSuccessChime, playFailureBuzz]);

  // Effect for initializing Three.js
  useEffect(() => {
    const cleanup = initThree();
    return cleanup;
  }, [initThree]);

  // Effect for starting/stopping animation loop
  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  // Handle intro progression
  const handleNextIntro = useCallback(() => {
    if (introStep < introMessages.length - 1) {
      setIntroStep(prev => prev + 1);
    } else {
      setShowIntro(false);
      // Only show the initial welcome message AFTER the intro sequence
      setTimeout(() => {
        showMysticalMessage("Welcome, architect. Forge your connection with the AI Cube...");
      }, 500);
    }
  }, [introStep, introMessages.length, showMysticalMessage]);

  // Keyboard event listener for debug UI toggle and Shift key for target visibility
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'D' || event.key === 'd') {
        setShowDebugUI(prev => !prev);
      }
      if (event.key === 'Shift' && targetMaterialRef.current) {
        targetMaterialRef.current.opacity = 1; // Full opacity on Shift press
      }
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Shift' && targetMaterialRef.current) {
        targetMaterialRef.current.opacity = 0.2; // Revert to original opacity on Shift release
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Initialize AudioContext (removed ambient drone logic) (Removed)
  // useEffect(() => { // Removed
  //   audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)(); // Removed
  //   // Removed ambient drone oscillator and gain node initialization // Removed
  //   return () => { // Removed
  //     audioContextRef.current?.close(); // Removed
  //   }; // Removed
  // }, []); // Removed

  // Removed useEffect for controlling ambient drone volume

  // Load best score from localStorage on component mount
  useEffect(() => {
    const storedBestScore = localStorage.getItem('bestResonance');
    if (storedBestScore) {
      setBestScore(Number(storedBestScore));
    }
  }, []);

  // Save best score to localStorage whenever resonanceScore updates
  useEffect(() => {
    if (resonanceScore > bestScore) {
      setBestScore(resonanceScore);
      localStorage.setItem('bestResonance', resonanceScore.toString());
    }
  }, [resonanceScore, bestScore]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white font-['Orbitron'] overflow-hidden">
      <HomeButton /> {/* Added HomeButton */}
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
          AI CUBE RESONANCE
        </h1>
        <p className="text-gray-400 text-sm tracking-[2px] uppercase">
          Align with the AI's cosmic patterns
        </p>
        {/* Mission Level and Best Score */}
        <div className="absolute top-4 right-4 text-right text-sm">
          <p className="text-yellow-300">Mission Level: <span className="font-bold">{missionLevel}</span></p>
          <p className="text-yellow-200">Best Score: <span className="font-bold">{bestScore}%</span></p>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex h-[calc(100vh-120px)] p-5 gap-5">
        {/* Canvas Area */}
        <div className="flex-[2] bg-black/20 rounded-2xl border-2 border-yellow-500/30 overflow-hidden backdrop-blur-sm">
          <div ref={mountRef} className="w-full h-full" />
        </div>

        {/* Control Panel */}
        <div className="flex-1 bg-black/30 rounded-2xl border-2 border-yellow-500/30 p-5 backdrop-blur-md overflow-y-auto">
          {/* Mission Control */}
          <div className="mb-6 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
            <h3 className="text-yellow-400 text-center mb-4 text-lg font-semibold">Mission Control</h3>
            <button
              onClick={startNewMission}
              className="w-full py-3 px-4 rounded-lg border-2 font-semibold uppercase tracking-wider transition-all duration-300 bg-yellow-500/60 border-yellow-400 shadow-lg shadow-yellow-500/50 text-yellow-100 hover:bg-yellow-500/40 hover:shadow-md hover:shadow-yellow-500/30"
            >
              Start New Mission
            </button>
            {missionActive && (
              <div className="mt-4 text-center">
                <p className="text-gray-300 text-sm mb-2">Target Parameters:</p>
                <div className="flex justify-around text-xs text-yellow-300 flex-wrap">
                  <span>Freq: {targetFrequency}</span>
                  <span>Amp: {targetAmplitude.toFixed(2)}</span>
                  <span>Speed: {targetSpeed.toFixed(3)}</span>
                  <span>Dist: {targetDistortion.toFixed(1)}</span>
                  <span>Comp: {targetComplexity.toFixed(1)}</span>
                </div>
              </div>
            )}
          </div>

          {/* AI Cube Parameters */}
          <div className="mb-6 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
            <h3 className="text-yellow-400 text-center mb-4 text-lg font-semibold">AI Cube Parameters</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-yellow-400 text-sm mb-2">
                  Wave Frequency: <span className="font-bold">{waveFrequency}</span>
                </label>
                <input
                  type="range"
                  min="2"
                  max="9"
                  value={waveFrequency}
                  onChange={(e) => setWaveFrequency(parseInt(e.target.value))}
                  className="w-full h-2 bg-yellow-500/30 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              <div>
                <label className="block text-yellow-400 text-sm mb-2">
                  Wave Amplitude: <span className="font-bold">{waveAmplitude.toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="0.4"
                  step="0.01"
                  value={waveAmplitude}
                  onChange={(e) => setWaveAmplitude(parseFloat(e.target.value))}
                  className="w-full h-2 bg-yellow-500/30 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              <div>
                <label className="block text-yellow-400 text-sm mb-2">
                  Wave Speed: <span className="font-bold">{waveSpeed.toFixed(3)}</span>
                </label>
                <input
                  type="range"
                  min="0.005"
                  max="0.025"
                  step="0.001"
                  value={waveSpeed}
                  onChange={(e) => setWaveSpeed(parseFloat(e.target.value))}
                  className="w-full h-2 bg-yellow-500/30 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              <div>
                <label className="block text-yellow-400 text-sm mb-2">
                  Distortion Strength: <span className="font-bold">{distortionStrength.toFixed(1)}</span>
                </label>
                <input
                  type="range"
                  min="0.3"
                  max="1.0"
                  step="0.1"
                  value={distortionStrength}
                  onChange={(e) => setDistortionStrength(parseFloat(e.target.value))}
                  className="w-full h-2 bg-yellow-500/30 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              <div>
                <label className="block text-yellow-400 text-sm mb-2">
                  Complexity Factor: <span className="font-bold">{complexityFactor.toFixed(1)}</span>
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="0.5"
                  step="0.1"
                  value={complexityFactor}
                  onChange={(e) => setComplexityFactor(parseFloat(e.target.value))}
                  className="w-full h-2 bg-yellow-500/30 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          </div>

          {/* Resonance Metrics */}
          <div className="mb-6 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
            <h3 className="text-yellow-400 text-center mb-4 text-lg font-semibold">Resonance Metrics</h3>
            <div className="bg-black/40 p-3 rounded-lg border border-yellow-500/30 text-center">
              <div className="text-gray-400 text-xs mb-1">Current Resonance</div>
              <div className="text-yellow-400 text-lg font-bold">{resonanceScore}%</div>
            </div>
          </div>

          {/* Resonate Button */}
          <button
            onClick={calculateResonance}
            className="w-full py-4 bg-gradient-to-r from-purple-600/30 to-blue-600/30 border-2 border-purple-500/50 rounded-xl text-purple-300 font-semibold uppercase tracking-wider transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-600/50 hover:to-blue-600/50 hover:shadow-lg hover:shadow-purple-500/30"
          >
            Resonate with AI
          </button>
        </div>
      </div>

      {/* Mystical Voice */}
      <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-md px-6 py-4 rounded-full border-2 border-yellow-500/50 text-yellow-400 text-center max-w-4xl transition-all duration-500 z-50 ${
        showMessage ? 'opacity-100' : 'opacity-0 pointer-events-none' // Use pointer-events-none when hidden
      }`}>
        {mysticalMessage}
      </div>

      {/* Intro Overlay */}
      {showIntro && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-yellow-500/50 rounded-2xl p-8 max-w-2xl text-center shadow-2xl">
            <h2 className="text-3xl font-black bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-6">
              Neural Forge: AI Cube Resonance
            </h2>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              {introMessages[introStep]}
            </p>
            <button
              onClick={handleNextIntro}
              className="py-3 px-8 rounded-lg border-2 font-semibold uppercase tracking-wider transition-all duration-300 bg-yellow-500/60 border-yellow-400 shadow-lg shadow-yellow-500/50 text-yellow-100 hover:bg-yellow-500/40 hover:shadow-md hover:shadow-yellow-500/30"
            >
              {introStep < introMessages.length - 1 ? 'Next' : 'Begin Forging'}
            </button>
          </div>
        </div>
      )}

      {/* Debug UI */}
      {showDebugUI && missionActive && (
        <div className="fixed top-5 left-5 bg-black/70 backdrop-blur-md p-4 rounded-lg border border-gray-600 text-gray-300 text-sm font-mono z-20">
          <h4 className="text-white text-md font-semibold mb-2">Debug Info (Press 'D' to toggle)</h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <span>Player Freq: {waveFrequency}</span><span>Target Freq: {targetFrequency}</span>
            <span>Deviation: {(Math.abs(waveFrequency - targetFrequency)).toFixed(2)}</span><span></span>

            <span>Player Amp: {waveAmplitude.toFixed(2)}</span><span>Target Amp: {targetAmplitude.toFixed(2)}</span>
            <span>Deviation: {(Math.abs(waveAmplitude - targetAmplitude)).toFixed(2)}</span><span></span>

            <span>Player Speed: {waveSpeed.toFixed(3)}</span><span>Target Speed: {targetSpeed.toFixed(3)}</span>
            <span>Deviation: {(Math.abs(waveSpeed - targetSpeed)).toFixed(3)}</span><span></span>

            <span>Player Dist: {distortionStrength.toFixed(1)}</span><span>Target Dist: {targetDistortion.toFixed(1)}</span>
            <span>Deviation: {(Math.abs(distortionStrength - targetDistortion)).toFixed(2)}</span><span></span>

            <span>Player Comp: {complexityFactor.toFixed(1)}</span><span>Target Comp: {targetComplexity.toFixed(1)}</span>
            <span>Deviation: {(Math.abs(complexityFactor - targetComplexity)).toFixed(2)}</span><span></span>
          </div>
          <p className="mt-2 text-yellow-400">Live Score: {resonanceScore}%</p>
        </div>
      )}

      {/* Custom Slider Styles (can be moved to CSS if preferred) */}
      <style>{`
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ffd700; /* Gold */
          cursor: grab;
          box-shadow: 0 0 5px rgba(255, 215, 0, 0.7);
          transition: background 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ffd700; /* Gold */
          cursor: grab;
          box-shadow: 0 0 5px rgba(255, 215, 0, 0.7);
          transition: background 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
        }

        .slider:hover::-webkit-slider-thumb {
          background: #ffec80; /* Lighter gold on hover */
          box-shadow: 0 0 10px rgba(255, 215, 0, 0.9);
        }

        .slider:hover::-moz-range-thumb {
          background: #ffec80; /* Lighter gold on hover */
          box-shadow: 0 0 10px rgba(255, 215, 0, 0.9);
        }
      `}</style>
    </div>
  );
};

export default NeuralForge;