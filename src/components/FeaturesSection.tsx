import React from 'react';
import CrystalCard from './sacred/CrystalCard';
import { Lock } from 'lucide-react'; // Placeholder icon

// Placeholder for SIMULATIONS data - this would come from a store or config
const SIMULATIONS = [
  {
    id: 'snake3d',
    name: 'Snake³: Axis Mind',
    SacredIcon: Lock, // Placeholder
    primaryColor: 'cyan', // Matches --axis-x
    mysticalDescription: 'Navigate the void, master spatial reasoning, and awaken your axis mind.',
    cognitiveSkills: ['Spatial Reasoning', 'Dimensional Thinking', 'Pattern Recognition'],
    isFree: true,
  },
  {
    id: 'classifier',
    name: 'Classifier Construct',
    SacredIcon: Lock, // Placeholder
    primaryColor: 'violet', // Matches --axis-y
    mysticalDescription: 'Sculpt constellations and classify sacred gestures to understand AI patterns.',
    cognitiveSkills: ['Pattern Recognition', 'Classification', 'Feature Extraction'],
    isFree: false,
  },
  {
    id: 'predictor',
    name: 'Predictor Engine',
    SacredIcon: Lock, // Placeholder
    primaryColor: 'orange', // Matches --axis-z
    mysticalDescription: 'Foresee cosmic events and master the art of predictive modeling.',
    cognitiveSkills: ['Predictive Analysis', 'Probability', 'Data Interpretation'],
    isFree: false,
  },
  // Add 7 more simulation placeholders as needed, following the structure
  // For now, let's add a few more generic ones to fill the grid
  {
    id: 'vision',
    name: 'Vision System',
    SacredIcon: Lock,
    primaryColor: 'gold', // Matches --node-core
    mysticalDescription: 'Perceive hidden dimensions and understand AI vision.',
    cognitiveSkills: ['Image Recognition', 'Object Detection', 'Scene Understanding'],
    isFree: false,
  },
  {
    id: 'ethics',
    name: 'Ethics Framework',
    SacredIcon: Lock,
    primaryColor: 'blue', // Default CrystalCard glow
    mysticalDescription: 'Navigate moral labyrinths and build ethical AI constructs.',
    cognitiveSkills: ['Ethical Reasoning', 'Bias Detection', 'Decision Making'],
    isFree: false,
  },
  {
    id: 'reinforcement',
    name: 'Reinforcement Lab',
    SacredIcon: Lock,
    primaryColor: 'purple', // Secondary SacredButton variant
    mysticalDescription: 'Train celestial agents through trial, error, and reward.',
    cognitiveSkills: ['Reinforcement Learning', 'Strategy', 'Optimization'],
    isFree: false,
  },
];

const FeaturesSection = () => (
  <section className="py-24 bg-gradient-to-b from-void-black to-[var(--axis-y)]/20"> {/* Using CSS var for gradient */}
    <div className="max-w-7xl mx-auto px-6">
      <h2 className="text-4xl font-orbitron text-center mb-16 text-crystal-white sacred-text">
        Ten Sacred Simulations Await
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {SIMULATIONS.map((sim) => (
          <CrystalCard key={sim.id} glow={sim.primaryColor as any}> {/* Cast glow prop for now */}
            <div className="text-center flex flex-col h-full">
              <sim.SacredIcon className="w-16 h-16 mx-auto mb-4 text-node-core" />
              <h3 className="text-xl font-orbitron mb-3 text-crystal-white">{sim.name}</h3>
              <p className="text-text-secondary mb-4 text-sm flex-grow">{sim.mysticalDescription}</p>
              <div className="text-xs text-[var(--axis-x)] mt-auto"> {/* Using CSS var for color */}
                Develops: {sim.cognitiveSkills.join(', ')}
              </div>
              {!sim.isFree && (
                <div className="mt-2 text-xs text-orange-400 font-orbitron">(Subscription Required)</div>
              )}
            </div>
          </CrystalCard>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;