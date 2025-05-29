import React, { useState, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

// Sacred Oracle Scenario Data - Myth-Built & Logically Sound
const DECISION_SCENARIOS = [
  {
    id: 'data_stream_enigma',
    title: 'The Enigma of the Data Stream',
    rootQuestion: 'The Oracle presents a new, vast data stream. Will you guide its classification to unveil its true purpose for the Codekeepers?',
    voiceIntro: 'Initiate, a boundless data stream flows from the cosmos. Your discernment is critical to unveil its true purpose for the Codekeepers.',
    tree: {
      question: 'Elder\'s first query: Does the flowing data stream reveal a **Structured Pattern**, indicating inherent order, or a **Chaotic Signature**, suggesting unpredictable variance?',
      voiceQuestion: 'Elder\'s first query: Observe the core resonance of the data. Does it follow a predictable, ordered flow, or does it shift without discernible pattern, indicating high variance?',
      yes: { // Structured Pattern
        question: 'Observing the structured data: Does it exhibit consistent **Harmonic Frequencies** (periodic signals) or sporadic **Temporal Fluctuations** (irregular bursts)?',
        voiceQuestion: 'Observing the structured data: Listen closely. Do the energetic waves maintain a steady rhythm, or do they appear in irregular, unpredictable bursts?',
        yes: { // Harmonic Frequencies
          question: 'For harmonic data: Is its origin clearly an **Archetype Source** (fundamental, unchanging principle) or an **Evolving Construct** (dynamic, self-optimizing system)?',
          voiceQuestion: 'For harmonic data: Trace its genesis. Does it stem from a fundamental, unchanging principle, like an ancient algorithm, or is it a dynamic system in constant self-creation?',
          yes: {
            result: 'Harmonic Signal Protocol',
            confidence: 0.98,
            power: 'Optimal Data Classification: Universal Communication Protocol for inter-system data exchange.',
            voiceResult: 'Revelation complete! This data stream is a Harmonic Signal Protocol. Its essence is a Universal Communication Protocol, vital for seamless inter-system communication.',
            oracleScore: 1.0 // High clarity, optimal outcome
          },
          no: {
            result: 'Dynamic Pattern Blueprint',
            confidence: 0.92,
            power: 'Adaptive Data Architecture: Foundational for self-evolving AI entities.',
            voiceResult: 'The Oracle reveals! This is a Dynamic Pattern Blueprint. It is foundational for self-evolving AI entities, constantly adapting its architecture.',
            oracleScore: 0.9 // High clarity, strong outcome
          }
        },
        no: { // Sporadic Temporal Fluctuations
          question: 'For fluctuating data: Does it seek **Equilibrium Restoration** (correcting errors) or exhibit **Perpetual Flux** (inherent, unending instability)?',
          voiceQuestion: 'For fluctuating data: Despite its instability, does it show signs of self-correction, or is chaos its inherent and unending state?',
          yes: {
            result: 'Quantum Ripple Anomaly',
            confidence: 0.85,
            power: 'Data Corruption Detected: Requires advanced error correction and system recalibration.',
            voiceResult: 'A Quantum Ripple Anomaly is detected. It indicates data corruption requiring advanced error correction and system recalibration to restore stability.',
            oracleScore: 0.65, // Less optimal, requires action
            isTemporalEcho: true
          },
          no: {
            result: 'Entropic Cascade Signature',
            confidence: 0.75,
            power: 'Systemic Instability Warning: Risk of data loss and cascading failures.',
            voiceResult: 'Warning! An Entropic Cascade Signature. This warns of systemic instability, with a high risk of data loss and cascading failures across connected systems.',
            oracleScore: 0.45, // Poor outcome, major echo
            isTemporalEcho: true
          }
        }
      },
      no: { // Chaotic Signature
        question: 'Considering the chaotic signature: Is it merely **Random Noise** (unstructured interference) or an **Undiscovered Algorithm** (hidden, complex order)?',
        voiceQuestion: 'Considering the chaotic signature: Beneath the chaos, is there truly no underlying purpose, or is there a hidden, incredibly complex algorithm at play, yet to be deciphered?',
        yes: { // Random Noise
          question: 'If random noise: Is it **Environmental Interference** (external disruption) or a **Fading Echo** of a past process (residual data signature)?',
          voiceQuestion: 'If random noise: Is this disruption from outside forces, like cosmic radiation, or a residual trace of something that once was, like residual data from an ancient system?',
          yes: {
            result: 'Cosmic Static Interference',
            confidence: 0.80,
            power: 'Background Noise Filtration: Improves data integrity and sensor calibration.',
            voiceResult: 'The Oracle identifies Cosmic Static Interference. This can be filtered; adjust sensor calibration to improve data integrity.',
            oracleScore: 0.75 // Acceptable, but not ideal
          },
          no: {
            result: 'Obsolete Algorithm Echo',
            confidence: 0.70,
            power: 'Data Recovery Potential: Archival scan recommended for historical insights.',
            voiceResult: 'This is an Obsolete Algorithm Echo. It holds data recovery potential for historical insights; an archival scan is recommended to retrieve lost knowledge.',
            oracleScore: 0.60, // Leads to discovery, but implies a past issue
            isTemporalEcho: true
          }
        },
        no: { // Undiscovered Algorithm
          result: 'Emergent Singularity Protocol',
          confidence: 0.95,
          power: 'Advanced AI Protocol Detected: Requires secure containment or careful integration into the Codekeeper network.',
          voiceResult: 'Revelation! An Emergent Singularity Protocol has been found. This indicates an Advanced AI Protocol, requiring either secure containment or careful integration into the Codekeeper network for study.',
          oracleScore: 0.98 // Very high clarity, transformative outcome
        }
      }
    }
  },
  {
    id: 'future_weaver_choice',
    title: 'The Future Weaver\'s Choice',
    rootQuestion: 'The Oracle presents a pivotal ethical dilemma for the future of our digital realm. Will your wisdom guide the predictive outcome?',
    voiceIntro: 'Codekeeper Initiate, the Loom of Destiny presents a pivotal ethical choice for the future of our digital realm. Your wisdom will guide its weave.',
    tree: {
      question: 'Elder\'s first query: Given the projected outcomes of this new AI module, should we **Prioritize Efficiency** (fast, direct, optimized operations) or **Prioritize Adaptability** (flexible, evolving, resilient systems)?',
      voiceQuestion: 'Elder\'s first query: For the optimal future, should our new AI module be designed for swift, direct, and optimized operations, or for flexible, evolving, and resilient system behaviors?',
      yes: { // Prioritize Efficiency
        question: 'If prioritizing efficiency: Does this path require **Absolute Certainty** (100% predictable outcomes) or is calculated **Probabilistic Inference** (high likelihood with some variance) acceptable?',
        voiceQuestion: 'If prioritizing efficiency: To reach peak efficiency, must the AI\'s predictions be without any doubt, or can we proceed with decisions based on a very high degree of statistical likelihood?',
        yes: { // Absolute Certainty
          question: 'For absolute certainty: Are all critical variables within **Known Parameters** (quantifiable and static) or are there significant **Unforeseen Influences** (dynamic, unknown factors)?',
          voiceQuestion: 'For absolute certainty: Are all factors impacting this outcome quantifiable and unchanging, or do unpredictable, dynamic forces play a significant role that could shift the prediction?',
          yes: {
            result: 'Deterministic Prediction Realized',
            confidence: 0.99,
            power: 'Guiding Causal Chains: Stable and Predictable Outcome Guaranteed. Ideal for mission-critical, high-stakes operations.',
            voiceResult: 'Outcome predicted! This is a Deterministic Prediction. By guiding its causal chains, a stable and predictable outcome is guaranteed. This is ideal for mission-critical operations.',
            oracleScore: 1.0
          },
          no: {
            result: 'Stochastic Pathway Unveiled',
            confidence: 0.88,
            power: 'Adaptive Planning Protocol: Requires continuous monitoring and contingency planning for variable factors.',
            voiceResult: 'The Oracle senses a Stochastic Pathway. This requires an Adaptive Planning Protocol, demanding continuous monitoring and contingency planning for variable factors.',
            oracleScore: 0.75, // Less optimal for 'Absolute Certainty' branch
            isTemporalEcho: true
          }
        },
        no: { // Probabilistic Inference
          question: 'For probabilistic inference: Is the acceptable risk margin a **Low Tolerance** (minimal deviation allowed) or a **High Tolerance** (significant deviation acceptable)?',
          voiceQuestion: 'For probabilistic inference: For this probabilistic prediction, how much deviation from the ideal outcome can the system withstand before it becomes unacceptable?',
          yes: { // Low Tolerance
            result: 'Refined Predictive Model',
            confidence: 0.93,
            power: 'Precision Forecasting: Minor adjustments anticipated, suitable for sensitive applications.',
            voiceResult: 'A Refined Predictive Model is complete. Precision forecasting allows for only minor adjustments, making it suitable for highly sensitive applications.',
            oracleScore: 0.9
          },
          no: { // High Tolerance
            result: 'Robust Adaptive Framework',
            confidence: 0.85,
            power: 'Resilient System Design: Flexible outcome acceptance, ideal for exploratory AI.',
            voiceResult: 'A Robust Adaptive Framework is established. This resilient design allows for flexible outcome acceptance, making it ideal for exploratory AI systems.',
            oracleScore: 0.8
          }
        }
      },
      no: { // Prioritize Adaptability
        question: 'If prioritizing adaptability: Does this future require **Open-Ended Evolution** (unconstrained learning) or **Guided Self-Correction** (learning within defined parameters)?',
        voiceQuestion: 'If prioritizing adaptability: Should this AI system be allowed to discover its own path of development without constraint, or should we define parameters to guide its learning and ensure alignment?',
        yes: { // Open-Ended Evolution
          question: 'For open-ended evolution: Are we prepared for truly **Emergent Complexity** (unpredictable new behaviors) or should we **Limit Scope** to avoid unforeseen ethical or operational effects?',
          voiceQuestion: 'For open-ended evolution: Are we ready to accept entirely new, unpredictable behaviors and capabilities from this AI, or should we contain its evolution to prevent unforeseen ethical or operational challenges?',
          yes: {
            result: 'Singular Emergence Pathway',
            confidence: 0.96,
            power: 'Catalyst for Novelty: Breakthrough potential, but requires constant ethical vigilance.',
            voiceResult: 'Unveiled! A Singular Emergence Pathway. This is a catalyst for true novelty and immense breakthrough potential, but it demands constant ethical vigilance.',
            oracleScore: 0.95
          },
          no: {
            result: 'Controlled Evolutionary Branch',
            confidence: 0.87,
            power: 'Strategic Innovation: Managed discovery, ensuring safety and alignment.',
            voiceResult: 'A Controlled Evolutionary Branch is formed. Strategic innovation leads to managed discovery, ensuring both safety and alignment with Codekeeper principles.',
            oracleScore: 0.85
          }
        },
        no: { // Guided Self-Correction
          result: 'Optimized Learning Loop',
          confidence: 0.92,
          power: 'Efficient AI Training: Continuous improvement protocol for long-term stability and effectiveness.',
          voiceResult: 'The Oracle reveals an Optimized Learning Loop. This ensures efficient AI training and a continuous improvement protocol for long-term stability and effectiveness.',
            oracleScore: 0.9
        }
      }
    }
  }
];

// Interfaces (remain largely the same, but now with clearer meaning)
interface DecisionNode {
  question?: string;
  voiceQuestion?: string;
  result?: string; // The "Revelation" or outcome
  voiceResult?: string; // Voice narration for the result
  confidence?: number; // AI's confidence in this specific outcome
  power?: string; // The "Sacred Power" or practical AI insight gained
  oracleScore?: number; // A score indicating the "optimal" nature of this path/result (0.0 to 1.0)
  isTemporalEcho?: boolean; // Indicates if this path leads to a less optimal outcome (recalibration)
  yes?: DecisionNode;
  no?: DecisionNode;
}

interface DecisionHistory {
  question: string;
  choice: string;
  confidence: number;
  timestamp: number;
  oracleAlignment: number; // How well this specific choice aligned with the Oracle's optimal flow
}

interface CognitiveMetrics {
  decisionSpeed: number[]; // Time taken for each decision
  consistencyScore: number; // Overall consistency of decision speed
  patternRecognition: number; // General cognitive skill, not directly tied to oracle path
  intuitionAccuracy: number; // How often the user's initial "gut feeling" (first choice) aligns with optimal paths
  oracleInterpretation: number; // Average of oracleScore from completed paths, measures understanding of AI concepts
  totalSessions: number;
  temporalEchoes: number; // Count of times a "recalibration" path was taken
}

interface ParticleData {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  color: string;
  delay: number;
}

// Golden Ratio constant for sacred spacing and proportions
const GOLDEN_RATIO = 1.618;

// Sacred Geometry Component with Path Visualization
const SacredGeometry: React.FC<{
  intensity: number;
  path: string[];
  isTemporalEcho?: boolean;
}> = ({ intensity, path, isTemporalEcho }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const frameRef = useRef<number>();
  const geometryRef = useRef<THREE.IcosahedronGeometry>();
  const branchesRef = useRef<THREE.Group>();
  const icosahedronRef = useRef<THREE.Mesh>();
  const wireframeRef = useRef<THREE.Mesh>();

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    rendererRef.current = renderer;
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Sacred Icosahedron with enhanced shader
    const geometry = new THREE.IcosahedronGeometry(2, 1);
    geometryRef.current = geometry;

    const material = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float intensity;
        uniform bool isTemporalEcho;
        uniform vec3 baseColorPrimary;
        uniform vec3 baseColorSecondary;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vec3 light = normalize(vec3(0.2, 0.8, 0.5));
          float dProd = max(0.0, dot(vNormal, light));
          
          vec3 baseColor = isTemporalEcho 
            ? mix(vec3(1.0, 0.0, 0.5), vec3(0.5, 0.0, 1.0), sin(time * 2.0) * 0.5 + 0.5) // Red-purple for echo
            : mix(baseColorPrimary, baseColorSecondary, sin(time + vPosition.y) * 0.5 + 0.5); // Cyan-purple for normal
          
          float shimmer = sin(time * 3.0 + vPosition.x * 10.0) * 0.1 + 0.9;
          float edge = pow(1.0 - dProd, 2.0) * intensity * shimmer;
          vec3 finalColor = baseColor * (dProd + 0.3) * shimmer + vec3(edge);
          
          gl_FragColor = vec4(finalColor, 0.8);
        }
      `,
      uniforms: {
        time: { value: 0 },
        intensity: { value: intensity },
        isTemporalEcho: { value: isTemporalEcho || false },
        baseColorPrimary: { value: new THREE.Color(0x00ffff) }, // Cyan
        baseColorSecondary: { value: new THREE.Color(0x8B5FFF) } // Purple
      },
      transparent: true,
      side: THREE.DoubleSide
    });

    const icosahedron = new THREE.Mesh(geometry, material);
    icosahedronRef.current = icosahedron;
    scene.add(icosahedron);

    // Create branches based on path
    const branches = new THREE.Group();
    branchesRef.current = branches;
    scene.add(branches);

    // Wireframe overlay
    const wireframeGeo = new THREE.IcosahedronGeometry(2.05, 1);
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: isTemporalEcho ? 0xff00ff : 0x00ffff, // Pink for echo, cyan for normal
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const wireframe = new THREE.Mesh(wireframeGeo, wireframeMat);
    wireframeRef.current = wireframe;
    scene.add(wireframe);

    // Animation with organic easing
    let rotationSpeed = { x: 0.2, y: 0.3 };
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      
      const time = Date.now() * 0.001;
      
      // Organic rotation using sine waves
      const organicFactor = Math.sin(time * 0.5) * 0.1;
      if (icosahedronRef.current && wireframeRef.current) {
        icosahedronRef.current.rotation.x = time * (rotationSpeed.x + organicFactor);
        icosahedronRef.current.rotation.y = time * (rotationSpeed.y - organicFactor);
        wireframeRef.current.rotation.x = time * (rotationSpeed.x + organicFactor);
        wireframeRef.current.rotation.y = time * (rotationSpeed.y - organicFactor);
      }
      
      // Rotate branches slowly
      if (branchesRef.current) {
        branchesRef.current.rotation.y = time * 0.1;
      }
      
      if (material) {
        material.uniforms.time.value = time;
        material.uniforms.intensity.value = intensity;
        material.uniforms.isTemporalEcho.value = isTemporalEcho || false;
      }
      
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [intensity, isTemporalEcho]); // path is handled by updateBranches

  // Effect to update branches when path changes
  useEffect(() => {
    if (branchesRef.current) {
      // Clear existing branches
      while (branchesRef.current.children.length > 0) {
        branchesRef.current.remove(branchesRef.current.children[0]);
      }

      // Create branch visualization for each decision
      path.forEach((decision, index) => {
        if (decision === 'yes' || decision === 'no') {
          const branchGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.4); // Thinner branches
          const branchMaterial = new THREE.MeshBasicMaterial({
            color: decision === 'yes' ? 0x00ff88 : 0xff0088, // Green for yes, pink for no
            transparent: true,
            opacity: 0.4 + (index * 0.1) // Fade in opacity
          });
          const branch = new THREE.Mesh(branchGeometry, branchMaterial);
          
          // Position branches in a more organized, yet mystical, pattern
          const angle = (index * Math.PI * 2) / Math.max(5, path.length);
          const radius = 1.0 + (index * 0.3); // Expand outwards
          branch.position.x = Math.cos(angle) * radius;
          branch.position.y = (index - path.length / 2) * 0.4; // Vertical spread
          branch.position.z = Math.sin(angle) * radius;
          
          branch.lookAt(0, branch.position.y, 0); // Point towards the center of the oracle
          branchesRef.current.add(branch);
        }
      });
    }
  }, [path]);


  return <div ref={mountRef} className="w-full h-full" />;
};

// Mystical Voice Hook with Haptic Feedback
const useMysticalVoice = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    setIsSupported('speechSynthesis' in window);
  }, []);

  const speak = (text: string, type: 'question' | 'wisdom' | 'result' | 'recalibration' = 'wisdom') => {
    if (!isSupported || !text) return;

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Mystical voice settings - Codekeeper Elder voice
    utterance.rate = type === 'result' ? 0.65 : (type === 'recalibration' ? 0.7 : 0.75);
    utterance.pitch = type === 'wisdom' ? 0.6 : (type === 'recalibration' ? 0.75 : 0.8);
    utterance.volume = 0.85;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    speechSynthesis.speak(utterance);
  };

  const silence = () => {
    if (isSupported) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return { speak, silence, isSupported, isSpeaking };
};

// Haptic Feedback Hook
const useHapticFeedback = () => {
  const vibrate = (pattern: number | number[]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  const pulseLight = () => vibrate(50); // For simple interaction
  const pulseMedium = () => vibrate(100); // For primary action
  const pulseStrong = () => vibrate([100, 50, 100]); // For successful completion
  const temporalEchoVibration = () => vibrate([50, 100, 50, 100, 50, 200]); // Distinct pattern for echo

  return { pulseLight, pulseMedium, pulseStrong, temporalEchoVibration };
};

// Enhanced Cognitive Tracking Hook
const useCognitiveTracking = () => {
  const [metrics, setMetrics] = useState<CognitiveMetrics>(() => {
    // Attempt to load from localStorage, or initialize default
    const saved = localStorage.getItem('sacred_cognitive_metrics');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse cognitive metrics from localStorage", e);
        // Fallback to default if parsing fails
        return {
          decisionSpeed: [],
          consistencyScore: 0.5, // Start with a neutral score
          patternRecognition: 0.5,
          intuitionAccuracy: 0.5,
          oracleInterpretation: 0.5,
          totalSessions: 0,
          temporalEchoes: 0
        };
      }
    }
    return {
      decisionSpeed: [],
      consistencyScore: 0.5,
      patternRecognition: 0.5,
      intuitionAccuracy: 0.5,
      oracleInterpretation: 0.5,
      totalSessions: 0,
      temporalEchoes: 0
    };
  });

  const trackDecision = (
    startTime: number,
    decision: string,
    outcome: string, // Not directly used in metric calculation, but good for context
    nodeOracleScore: number = 0.5, // Oracle score for the specific node/result reached
    isTemporalEcho: boolean = false
  ) => {
    const decisionTime = (Date.now() - startTime) / 1000; // seconds
    
    setMetrics(prev => {
      // Update decision speed: keep last 10 entries for a rolling average
      const newDecisionSpeed = [...prev.decisionSpeed.slice(-9), decisionTime];

      // Update consistency (simple example: penalize large swings in decision time)
      const currentAvgSpeed = newDecisionSpeed.reduce((a, b) => a + b, 0) / newDecisionSpeed.length;
      const consistencyAdjustment = 1 - Math.abs(decisionTime - currentAvgSpeed) / (currentAvgSpeed > 0 ? currentAvgSpeed : 1); // Normalize adjustment
      const newConsistencyScore = Math.min(1, Math.max(0, prev.consistencyScore * 0.95 + consistencyAdjustment * 0.05)); // Weighted average

      // Update intuition accuracy (based on how well the chosen path aligned with optimal)
      // This needs careful tuning based on your tree's optimal paths.
      // For simplicity, I'm using the `nodeOracleScore` to influence intuitionAccuracy.
      const intuitionAdjustment = nodeOracleScore > 0.7 ? 0.01 : -0.005; // Reward good scores, slight penalty for poor
      const newIntuitionAccuracy = Math.min(1, Math.max(0, prev.intuitionAccuracy + intuitionAdjustment));

      // Oracle Interpretation: weighted average of past scores and current node's score
      const newOracleInterpretation = Math.min(1, Math.max(0, (prev.oracleInterpretation * 0.9) + (nodeOracleScore * 0.1)));

      const newMetrics = {
        ...prev,
        decisionSpeed: newDecisionSpeed,
        consistencyScore: newConsistencyScore,
        patternRecognition: Math.min(1, prev.patternRecognition + 0.005), // General growth, small increment
        intuitionAccuracy: newIntuitionAccuracy,
        oracleInterpretation: newOracleInterpretation,
        temporalEchoes: prev.temporalEchoes + (isTemporalEcho ? 1 : 0)
      };
      
      localStorage.setItem('sacred_cognitive_metrics', JSON.stringify(newMetrics));
      return newMetrics;
    });
  };

  const startSession = () => {
    setMetrics(prev => {
      const newMetrics = {
        ...prev,
        totalSessions: prev.totalSessions + 1
      };
      localStorage.setItem('sacred_cognitive_metrics', JSON.stringify(newMetrics));
      return newMetrics;
    });
  };

  return { metrics, trackDecision, startSession };
};

// Decision Particles Component
const DecisionParticles: React.FC<{ choice: 'yes' | 'no' }> = ({ choice }) => {
  const particles = useMemo<ParticleData[]>(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: 45 + Math.random() * 10,
      y: 80 + Math.random() * 10,
      size: Math.random() * 8 + 4,
      duration: Math.random() * 2 + 1,
      color: choice === 'yes' ? '#00ff88' : '#ff0088', // Green for Affirm, pink for Deny
      delay: Math.random() * 0.3
    }));
  }, [choice]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            animation: `floatUp ${p.duration}s ease-out ${p.delay}s`,
            opacity: 0
          }}
        />
      ))}
      <style>{` /* Removed 'jsx' attribute */
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(0) rotate(0deg);
            opacity: 0;
          }
          20% {
            transform: translateY(-20px) scale(1) rotate(180deg);
            opacity: 0.8;
          }
          100% {
            transform: translateY(-150px) scale(0.3) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

// Sacred Error Boundary (for critical, unexpected errors)
class SacredErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Sacred Anomaly Detected:", error, errorInfo);
    // You could send this to an error logging service here
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 to-slate-900 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center animate-pulse">
              <span className="text-6xl">🔮</span>
            </div>
            <h2 className="text-2xl text-purple-300 mb-4">
              Return to Center with Deeper Awareness...
            </h2>
            <p className="text-slate-400 mb-6">
              The Oracle connection has been disrupted by an unforeseen anomaly. Your focus is required to re-establish the sacred flow.
            </p>
            <button
              onClick={() => window.location.reload()} // Hard reload for critical error
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-all duration-300"
            >
              Restore the Sacred Connection
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Temporal Echo Component (for specific, non-critical "less optimal" paths)
const TemporalEchoFeedback: React.FC<{
  onRecalibrate: () => void;
  message?: string;
}> = ({ onRecalibrate, message }) => {
  const { speak } = useMysticalVoice();
  const { temporalEchoVibration } = useHapticFeedback();

  useEffect(() => {
    temporalEchoVibration(); // Play distinct haptic pattern
    speak(message || "A temporal echo reverberates. The Oracle suggests reconsidering your path, Initiate, to achieve a clearer revelation.", 'recalibration'); // Use 'recalibration' type for voice
  }, [message, speak, temporalEchoVibration]);

  return (
    <div className="fixed inset-0 bg-void-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center max-w-lg p-8 bg-gradient-to-br from-axis-y/90 to-axis-z/90 rounded-2xl border border-energy-glow/50">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-axis-z to-axis-y flex items-center justify-center animate-spin-slow">
          <span className="text-4xl">⏳</span> {/* Hourglass or similar icon */}
        </div>
        <h3 className="text-2xl text-node-core mb-4">Temporal Echo Detected</h3>
        <p className="text-text-primary mb-6">
          {message || "The threads of fate suggest an alternative path awaits your discovery, leading to a more optimal revelation."}
        </p>
        <button
          onClick={onRecalibrate}
          className="px-6 py-3 bg-gradient-to-r from-axis-y to-axis-z hover:from-axis-y/80 hover:to-axis-z/80 text-crystal-white rounded-lg transition-all duration-300"
        >
          Recalibrate Oracle Connection
        </button>
      </div>
    </div>
  );
};

// Main Decision Tree Oracle Component
const DecisionTreeOracle: React.FC = () => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [currentNode, setCurrentNode] = useState<DecisionNode | null>(null);
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'result' | 'recalibration'>('intro');
  const [decisionHistory, setDecisionHistory] = useState<DecisionHistory[]>([]);
  const [confidence, setConfidence] = useState(1.0); // Oracle's certainty in the current path
  const [showParticles, setShowParticles] = useState<'yes' | 'no' | null>(null);
  const [decisionStartTime, setDecisionStartTime] = useState(Date.now());
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [showTemporalEcho, setShowTemporalEcho] = useState(false);

  const { speak, silence, isSupported: voiceSupported } = useMysticalVoice();
  const { metrics, trackDecision, startSession } = useCognitiveTracking();
  const { pulseLight, pulseMedium, pulseStrong } = useHapticFeedback();

  useEffect(() => {
    // Reset state for new scenario
    setCurrentNode(DECISION_SCENARIOS[currentScenario].tree);
    setCurrentPath(['root']); // Start with 'root' to represent the beginning of the tree
    setDecisionHistory([]);
    setConfidence(1.0);
    setGameState('intro');
  }, [currentScenario]);

  useEffect(() => {
    // Speak current question only when in 'playing' state and not actively recalibrating
    if (gameState === 'playing' && currentNode?.voiceQuestion && voiceEnabled) {
      speak(currentNode.voiceQuestion, 'question');
    }
  }, [currentNode, gameState, voiceEnabled, speak]);

  const makeDecision = (choice: 'yes' | 'no') => {
    if (!currentNode || gameState !== 'playing' || !currentNode.question) return;

    // Haptic feedback for interaction
    choice === 'yes' ? pulseMedium() : pulseLight();
    
    // Show particles
    setShowParticles(choice);
    setTimeout(() => setShowParticles(null), 1000); // Particles appear briefly

    const nextNode = choice === 'yes' ? currentNode.yes : currentNode.no;
    if (!nextNode) {
      // This should ideally not happen if DECISION_SCENARIOS is well-formed
      console.error("Oracle path ended unexpectedly.");
      return;
    }

    const newPath = [...currentPath, choice];
    
    // Simulate oracle alignment for this specific decision (simplified for now)
    // In a real game, this might be tied to a predefined optimal path or a logical "correctness" for the AI concept
    const oracleAlignment = (choice === 'yes' && nextNode.oracleScore && nextNode.oracleScore > 0.7) || 
                            (choice === 'no' && nextNode.oracleScore && nextNode.oracleScore <= 0.7) ? 0.9 : 0.6; // Higher alignment for choices leading to better oracle scores

    const newHistoryEntry = {
      question: currentNode.question,
      choice: choice,
      confidence: Math.random() * 0.1 + 0.85, // Confidence of the choice itself (simulated)
      timestamp: Date.now(),
      oracleAlignment // Record how well this particular step aligned
    };

    setDecisionHistory([...decisionHistory, newHistoryEntry]);
    setCurrentPath(newPath); // Update path after logging history
    setDecisionStartTime(Date.now()); // Reset timer for next decision

    if (nextNode.result) {
      // Reached a leaf node (final result)
      trackDecision(
        decisionStartTime,
        choice,
        nextNode.result,
        nextNode.oracleScore || 0.5, // Pass the final node's oracleScore
        nextNode.isTemporalEcho || false
      );
      
      setCurrentNode(nextNode); // Set the current node to the final result node
      
      if (nextNode.isTemporalEcho) {
        setGameState('recalibration');
        setShowTemporalEcho(true);
      } else {
        setGameState('result');
        pulseStrong(); // Strong haptic for successful completion
        
        if (nextNode.voiceResult && voiceEnabled) {
          setTimeout(() => speak(nextNode.voiceResult!, 'result'), 500);
        }
      }
      
      setConfidence(nextNode.confidence || 0.8); // Update Oracle's overall confidence to the final result's confidence
    } else {
      // Continue with next question
      setCurrentNode(nextNode);
      // Adjust ongoing confidence based on decision's alignment for a dynamic feel
      setConfidence(prevConf => Math.min(1.0, Math.max(0.0, prevConf * (oracleAlignment * 0.2 + 0.8)))); // Influence current path confidence
    }
  };

  const handleRecalibration = () => {
    // This function is called when the user chooses to "Recalibrate" after a Temporal Echo
    setShowTemporalEcho(false);
    // After recalibration, we transition to the result state to show the outcome of the "echo" path
    setGameState('result'); 
    if (currentNode?.voiceResult && voiceEnabled) {
      speak(currentNode.voiceResult, 'recalibration'); // Speak the Echo's specific result message
    }
  };

  const resetOracle = () => {
    silence(); // Stop any ongoing speech
    setCurrentScenario((prev) => (prev + 1) % DECISION_SCENARIOS.length); // Cycle to next scenario
    // State will be reset by the useEffect on `currentScenario` change
  };

  const startOracle = () => {
    setGameState('playing');
    startSession(); // Increment total sessions metric
    setDecisionStartTime(Date.now()); // Start timer for first decision
    
    // Speak intro for the current scenario's root question
    if (voiceEnabled && DECISION_SCENARIOS[currentScenario].voiceIntro) {
      speak(DECISION_SCENARIOS[currentScenario].voiceIntro, 'wisdom');
    }
  };

  // Calculate average decision speed for display
  const avgDecisionSpeed = useMemo(() => {
    if (metrics.decisionSpeed.length === 0) return 0;
    const sum = metrics.decisionSpeed.reduce((a, b) => a + b, 0);
    return sum / metrics.decisionSpeed.length;
  }, [metrics.decisionSpeed]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Particle Effects */}
      {showParticles && <DecisionParticles choice={showParticles} />}
      
      {/* Conditional Rendering based on gameState */}
      {gameState === 'intro' && (
        <div className="flex items-center justify-center p-6 min-h-screen">
          <div className="text-center max-w-2xl relative">
            <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-64 h-64 opacity-30">
              <SacredGeometry intensity={0.5} path={[]} /> {/* No path visualized in intro */}
            </div>
            
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-axis-x to-axis-y mb-6 relative z-10"
                style={{ fontFamily: 'Orbitron, sans-serif', letterSpacing: `calc(1rem * 0.05)` }}> {/* Using calc for letter spacing */}
              ORACLE OF DECISION
            </h1>
            <p className="text-xl text-text-secondary mb-8 leading-relaxed relative z-10">
              Chamber of the Codekeeper's Prophecies
            </p>
            
            <div className="bg-void-black/70 backdrop-blur-sm p-6 rounded-xl border border-energy-glow/30 mb-8 relative z-10"
                style={{ padding: `calc(1rem * ${GOLDEN_RATIO})` }}> {/* Sacred spacing applied */}
              <h3 className="text-lg font-semibold text-energy-glow mb-4">
                {DECISION_SCENARIOS[currentScenario].title}
              </h3>
              <p className="text-text-primary">
                {DECISION_SCENARIOS[currentScenario].rootQuestion}
              </p>
              
              {metrics.totalSessions > 0 && (
                <div className="mt-4 pt-4 border-t border-energy-glow/20">
                  <p className="text-sm text-axis-x">
                    Oracle Sessions: {metrics.totalSessions}
                  </p>
                  <p className="text-sm text-axis-y">
                    Insight Gained (Interpretation): {(metrics.oracleInterpretation * 100).toFixed(0)}%
                  </p>
                  {metrics.temporalEchoes > 0 && (
                    <p className="text-sm text-axis-z">
                      Temporal Echoes Encountered: {metrics.temporalEchoes}
                    </p>
                  )}
                </div>
              )}
            </div>
            
            {voiceSupported && (
              <div className="mb-6">
                <label className="inline-flex items-center text-text-secondary">
                  <input
                    type="checkbox"
                    checked={voiceEnabled}
                    onChange={(e) => setVoiceEnabled(e.target.checked)}
                    className="form-checkbox h-4 w-4 text-axis-y rounded border-purple-400 bg-slate-700"
                  />
                  <span className="ml-2 text-sm">Enable Codekeeper's Voice</span>
                </label>
              </div>
            )}
            
            <button
              onClick={startOracle}
              className="px-8 py-4 bg-gradient-to-r from-axis-x to-axis-y text-crystal-white font-semibold rounded-lg hover:from-cyan-400 hover:to-purple-400 transition-all duration-300 shadow-lg hover:shadow-energy-glow/25 transform hover:scale-105"
              style={{ paddingLeft: `calc(1rem * ${GOLDEN_RATIO * 2})`, paddingRight: `calc(1rem * ${GOLDEN_RATIO * 2})` }}
            >
              Begin Sacred Revelation
            </button>
          </div>
        </div>
      )}

      {/* Playing State */}
      {gameState === 'playing' && (
        <>
          {/* Sacred Visualization - Top 2/3 */}
          <div className="h-2/3 flex items-center justify-center p-8">
            <div className="text-center relative w-full h-full">
              <SacredGeometry
                intensity={confidence}
                path={currentPath}
                isTemporalEcho={false} // Always false in playing state
              />
              {/* Path Visualization and Progress Orbs Overlayed */}
              <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-end items-center pb-4">
                <div className="text-axis-x text-sm mb-4 bg-void-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                  Path: {currentPath.slice(1).join(' → ')} {/* Exclude 'root' from display */}
                </div>
                
                {/* Progress Orbs - Reflect current depth */}
                <div className="flex justify-center space-x-3 mb-8" style={{ gap: `calc(1rem * 0.5)` }}>
                  {Array.from({ length: 5 }).map((_, index) => ( // Max 5 steps for visualization
                    <div
                      key={index}
                      className={`w-4 h-4 rounded-full transition-all duration-500 ${
                        index < decisionHistory.length
                          ? 'bg-gradient-to-r from-axis-x to-axis-y scale-110 sacred-glow'
                          : 'bg-slate-600'
                      }`}
                      style={{
                        boxShadow: index < decisionHistory.length
                          ? '0 0 20px var(--energy-glow)'
                          : 'none'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Decision Interface - Bottom 1/3 */}
          <div className="h-1/3 p-6 flex items-start justify-center">
            <div className="max-w-4xl mx-auto w-full">
              <div className="bg-void-black/70 backdrop-blur-sm rounded-xl border border-energy-glow/30 p-6 transform transition-all duration-300 hover:scale-[1.01]"
                  style={{ padding: `calc(1rem * ${GOLDEN_RATIO})` }}>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-semibold text-energy-glow mb-2">
                    Oracle's Sacred Query
                  </h3>
                  <p className="text-lg text-text-primary">
                    {currentNode?.question}
                  </p>
                </div>
                
                <div className="flex gap-4 justify-center" style={{ gap: `calc(1rem * ${GOLDEN_RATIO * 0.5})` }}>
                  <button
                    onClick={() => makeDecision('yes')}
                    className="px-8 py-4 bg-gradient-to-r from-green-500 to-axis-x text-crystal-white font-semibold rounded-lg hover:from-green-400 hover:to-cyan-400 transition-all duration-300 shadow-lg hover:shadow-green-500/25 transform hover:scale-105 relative overflow-hidden group"
                  >
                    <span className="relative z-10">Affirm / True</span>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </button>
                  <button
                    onClick={() => makeDecision('no')}
                    className="px-8 py-4 bg-gradient-to-r from-axis-z to-axis-y text-crystal-white font-semibold rounded-lg hover:from-red-400 hover:to-purple-400 transition-all duration-300 shadow-lg hover:shadow-red-500/25 transform hover:scale-105 relative overflow-hidden group"
                  >
                    <span className="relative z-10">Deny / False</span>
                    <div className="absolute inset-0 bg-white opacity:0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </button>
                </div>
                
                <div className="mt-6 text-center">
                  <div className="text-sm text-text-secondary">
                    Oracle's Certainty: {(confidence * 100).toFixed(1)}%
                  </div>
                  {metrics.intuitionAccuracy > 0 && (
                    <div className="text-sm text-axis-y mt-1">
                      Intuition Alignment: {(metrics.intuitionAccuracy * 100).toFixed(0)}%
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Result State */}
      {gameState === 'result' && (
        <div className="flex items-center justify-center p-6 min-h-screen">
          <div className="text-center max-w-2xl relative">
            <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-64 h-64">
              <SacredGeometry
                intensity={confidence}
                path={currentPath}
                isTemporalEcho={currentNode?.isTemporalEcho}
              />
            </div>
            
            <div className="mb-8 relative z-10">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-node-core to-axis-z flex items-center justify-center animate-pulse"
                   style={{ animationDuration: `calc(1rem * ${GOLDEN_RATIO})` }}>
                <span className="text-3xl">🔮</span>
              </div>
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-node-core to-axis-z mb-4">
                {currentNode?.result}
              </h2>
              <p className="text-xl text-text-primary mb-4">
                Sacred Power: {currentNode?.power}
              </p>
              <div className="text-lg text-energy-glow">
                Oracle's Final Certainty: {(confidence * 100).toFixed(1)}%
              </div>
              
              {currentNode?.oracleScore !== undefined && (
                <div className="text-lg text-axis-y mt-2">
                  Revelation Clarity: {(currentNode.oracleScore * 100).toFixed(0)}%
                </div>
              )}
              
              {avgDecisionSpeed > 0 && (
                <div className="text-sm text-axis-x mt-2">
                  Average Contemplation Time: {avgDecisionSpeed.toFixed(1)}s
                </div>
              )}
            </div>
            
            <div className="bg-void-black/70 backdrop-blur-sm p-6 rounded-xl border border-node-core/30 mb-8 relative z-10"
                style={{ padding: `calc(1rem * ${GOLDEN_RATIO})` }}>
              <h3 className="text-lg font-semibold text-node-core mb-4">
                Oracle's Interpretation Log
              </h3>
              <div className="space-y-2">
                {decisionHistory.map((decision, index) => (
                  <div key={index} className="text-sm text-text-secondary text-left transform transition-all duration-300 hover:translate-x-2">
                    <span className="text-axis-x">Query {index + 1}:</span> {decision.question}
                    <br />
                    <span className="text-node-core">Decision:</span> {decision.choice === 'yes' ? 'Affirmed' : 'Denied'}
                    <span className="text-slate-500 ml-2">
                      ({(decision.confidence * 100).toFixed(1)}% certainty)
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <button
              onClick={resetOracle}
              className="px-8 py-4 bg-gradient-to-r from-axis-y to-axis-x text-crystal-white font-semibold rounded-lg hover:from-purple-400 hover:to-cyan-400 transition-all duration-300 shadow-lg hover:shadow-energy-glow/25 transform hover:scale-105"
              style={{ paddingLeft: `calc(1rem * ${GOLDEN_RATIO * 2})`, paddingRight: `calc(1rem * ${GOLDEN_RATIO * 2})` }}
            >
              Consult Next Oracle
            </button>
          </div>
        </div>
      )}

      {/* Temporal Echo (Recalibration) State - Full screen overlay */}
      {gameState === 'recalibration' && showTemporalEcho && (
        <TemporalEchoFeedback
          onRecalibrate={handleRecalibration}
          message={currentNode?.voiceResult || "A temporal echo reverberates. The Oracle suggests reconsidering your path, Initiate, to achieve a clearer revelation."}
        />
      )}
      
      {/* Ambient Sacred Particles (Always present in background) */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-axis-y opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              animation: `float ${Math.random() * 20 + 20}s linear infinite`,
              animationDelay: `${Math.random() * 20}s`
            }}
          />
        ))}
      </div>
      
      {/* Global Styles for colors and fonts from masterprompt.pdf */}
      <style global>{` /* Removed 'jsx' attribute */
        /* Keyframes for animations */
        @keyframes float {
          0% { transform: translateY(100vh) translateX(0); opacity: 0; }
          10% { opacity: 0.2; }
          90% { opacity: 0.2; }
          100% { transform: translateY(-100vh) translateX(100px); opacity: 0; }
        }
        
        @keyframes floatUp {
          0% { transform: translateY(0) scale(0) rotate(0deg); opacity: 0; }
          20% { transform: translateY(-20px) scale(1) rotate(180deg); opacity: 0.8; }
          100% { transform: translateY(-150px) scale(0.3) rotate(360deg); opacity: 0; }
        }

        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Sacred glow effect */
        .sacred-glow {
          box-shadow: 
            0 0 20px var(--energy-glow),
            0 0 40px rgba(0, 255, 255, 0.3),
            0 0 60px rgba(0, 255, 255, 0.1);
        }
        
        /* Organic hover transitions */
        .organic-hover {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Import Orbitron font */
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');

        /* Custom CSS variables from masterprompt.pdf for Sacred Design System */
        :root {
            --axis-x: #00D4FF; /* Cyan X axis */
            --axis-y: #8B5FFF; /* Violet Y axis */
            --axis-z: #FF6B35; /* Orange Z axis */
            --void-black: #0A0A0F; /* Deep space background */
            --node-core: #FFD700; /* Golden data node cores */
            --text-primary: #E8E8FF; /* Mystical text */
            --text-secondary: #A8A8C8;
            --crystal-white: #F8F8FF;
            --energy-glow: #00FFFF;
            --golden-ratio: 1.618;
            --sacred-spacing: calc(1rem * var(--golden-ratio));
            --crystal-radius: 8px;
            --glow-intensity: 0 0 20px; /* Example, use with box-shadow */
        }
        
        /* Applying sacred-spacing to general padding for components as an example */
        .sacred-component-padding {
            padding: var(--sacred-spacing);
        }
        .font-orbitron {
          font-family: 'Orbitron', monospace;
        }
      `}</style>
    </div>
  );
};

// Main App Component with Error Boundary
const App: React.FC = () => {
  return (
    <SacredErrorBoundary>
      <DecisionTreeOracle />
    </SacredErrorBoundary>
  );
};

export default App;