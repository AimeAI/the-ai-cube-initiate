import React, { useEffect, useRef } from 'react'; // Added useRef
import { useMachine } from '@xstate/react';
import { classifierMachine } from '../machines/classifierMachine';
import PhaserGame from './PhaserGame';
import ConfusionMatrixPanel from './ConfusionMatrixPanel';
import MissionImpactReport from './MissionImpactReport'; // Import the new report component
import useVoiceSynthesis from '../hooks/useVoiceSynthesis';
import ttsScripts from '../../public/tts/classifierConstruct.json';
import { useState, useEffect, useRef } from 'react'; // Added useEffect, useRef to imports

interface ClassifierModuleProps {
  onModuleComplete?: () => void; // Optional for now, but should be provided by Index.tsx
}

const ClassifierModule: React.FC<ClassifierModuleProps> = (props) => {
  const { speak, supported: voiceSupported, voices, selectedVoice, setSelectedVoice } = useVoiceSynthesis();
  const introPlayedRef = useRef(false);

  // State for simulated accuracy and attempts
  const [simulatedAccuracy, setSimulatedAccuracy] = useState(0.75); // Default to 75%
  const [simulatedAttempts, setSimulatedAttempts] = useState(10);   // Default to 10 attempts

  const [current, send] = useMachine(classifierMachine, {
    actions: {
      logIntroEntry: () => {
        console.log('State: INTRO (via XState action)');
      },
      speakIntroAction: () => {
        if (!voiceSupported || introPlayedRef.current) {
          if (introPlayedRef.current) console.log('Intro already played.');
          return;
        }
        const introCue = ttsScripts.cues.find(cue => cue.state === 'INTRO' && cue.event === 'onEnter');
        if (introCue) {
          console.log('Speaking intro:', introCue.script);
          speak(introCue.script, () => {
            console.log('Intro speech finished.');
            introPlayedRef.current = true; 
          });
        } else {
          console.log('Intro script not found.');
        }
      },
      triggerReturnToVault: () => { // Implement the new action
        console.log("Action: triggerReturnToVault called. Calling props.onModuleComplete.");
        if (props.onModuleComplete) {
          props.onModuleComplete();
        }
      },
    }
  });

  useEffect(() => {
    console.log('XState Current State:', current.value);
    // Reset introPlayedRef if we re-enter INTRO state and it's desired to play again (e.g., after a full loop/reset)
    // For now, it plays once per component lifecycle if INTRO is the initial state.
    if (current.value !== 'INTRO') {
        // introPlayedRef.current = false; 
    }

  }, [current]);
  
  // Voice selection UI (optional, for demonstration)
  useEffect(() => {
    if (voiceSupported && voices.length > 0 && !selectedVoice) {
        const enVoice = voices.find(v => v.lang.startsWith('en-US')) || voices.find(v => v.lang.startsWith('en')) || voices[0];
        if (enVoice) {
            setSelectedVoice(enVoice.voiceURI);
            console.log('Default voice set to:', enVoice.name);
        }
    }
  }, [voiceSupported, voices, setSelectedVoice, selectedVoice]);


  const renderContent = () => {
    // You can also log context if needed: console.log('XState Context:', current.context);
  }, [current]);

  const renderContent = () => {
    switch (current.value) {
      case 'INTRO':
        return (
          <div className="text-center p-8 bg-gray-900 text-white rounded-lg shadow-lg border border-cyan-500">
            <h2 className="text-3xl font-bold text-cyan-400 mb-4">Welcome to Classifier Construct!</h2>
            <p className="mb-6 text-lg">
              Your mission is to classify incoming alien signals. Use your analytical skills to sort them into the correct categories.
            </p
            <button
              onClick={() => send('START_MISSION')}
              className="px-6 py-3 font-bold rounded-lg shadow-md transition-all duration-150 ease-out
                         bg-green-600 text-white border-2 border-green-400 
                         hover:bg-green-500 hover:shadow-green-400/50 hover:shadow-lg
                         focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-opacity-50"
            >
              Start Mission
            </button>
          </div>
        );
      case 'INTERACT':
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Classify the Aliens!</h2>
            <PhaserGame />
            
            {/* UI for simulating accuracy and attempts */}
            <div className="my-4 p-4 bg-gray-800 rounded-lg shadow-md max-w-md mx-auto">
              <h4 className="text-lg font-semibold text-yellow-400 mb-3">Simulation Controls (Dev Only)</h4>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <div>
                  <label htmlFor="simAccuracy" className="block text-sm font-medium text-gray-300 mb-1">
                    Session Accuracy (0.0 - 1.0):
                  </label>
                  <input
                    type="number"
                    id="simAccuracy"
                    value={simulatedAccuracy}
                    onChange={(e) => setSimulatedAccuracy(parseFloat(e.target.value))}
                    step="0.01"
                    min="0"
                    max="1"
                    className="w-full sm:w-auto bg-gray-700 text-white border border-gray-600 rounded-md p-2 text-sm focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>
                <div>
                  <label htmlFor="simAttempts" className="block text-sm font-medium text-gray-300 mb-1">
                    Session Attempts:
                  </label>
                  <input
                    type="number"
                    id="simAttempts"
                    value={simulatedAttempts}
                    onChange={(e) => setSimulatedAttempts(parseInt(e.target.value, 10))}
                    step="1"
                    min="1"
                    className="w-full sm:w-auto bg-gray-700 text-white border border-gray-600 rounded-md p-2 text-sm focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => send({ 
                type: 'CLASSIFICATION_COMPLETE', 
                accuracy: simulatedAccuracy, 
                attemptsMade: simulatedAttempts 
              })}
              className="mt-2 px-6 py-3 font-bold rounded-lg shadow-md transition-all duration-150 ease-out
                         bg-blue-600 text-white border-2 border-blue-400
                         hover:bg-blue-500 hover:shadow-blue-400/50 hover:shadow-lg
                         focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
            >
              Finish Classification & View Feedback
            </button>
          </div>
        );
      case 'FEEDBACK':
        return (
          <div className="text-center p-8">
            <h2 className="text-3xl font-bold text-cyan-400 mb-4">Classification Feedback</h2>
            <p className="mb-2 text-lg">Accuracy for this round: {current.context.accuracy * 100}%</p>
            <ConfusionMatrixPanel /> {/* Assuming this panel shows relevant data */}
            <button
              onClick={() => send('CONTINUE_TO_REPORT')}
              className="mt-6 px-6 py-3 font-bold rounded-lg shadow-md transition-all duration-150 ease-out
                         bg-yellow-500 text-gray-900 border-2 border-yellow-300
                         hover:bg-yellow-400 hover:shadow-yellow-300/50 hover:shadow-lg
                         focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:ring-opacity-50"
            >
              View Mission Report
            </button>
          </div>
        );
      case 'REPORT':
        return (
          <div className="p-4"> {/* Outer padding for the state view */}
            <MissionImpactReport accuracy={Math.round(current.context.accuracy * 100)} />
            <div className="text-center mt-8">
              {current.context.accuracy * 100 >= 85 ? (
                 <p className="text-green-400 font-bold mb-4">Performance Threshold Met: Module UNLOCK sequence initiated.</p>
              ) : (
                 <p className="text-red-400 font-bold mb-4">Performance Threshold Not Met. Further calibration required.</p>
              )}
              <button
                onClick={() => send('RETURN_TO_VAULT')} // Changed event type
                className="px-6 py-3 font-bold rounded-lg shadow-md transition-all duration-150 ease-out mr-2
                           bg-indigo-600 text-white border-2 border-indigo-400
                           hover:bg-indigo-500 hover:shadow-indigo-400/50 hover:shadow-lg
                           focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-50"
              >
                Return to Vault {/* Changed button text */}
              </button>
              <button
                onClick={() => send('RETRY_LEVEL')}
                className="px-6 py-3 font-bold rounded-lg shadow-md transition-all duration-150 ease-out
                           bg-gray-600 text-white border-2 border-gray-400
                           hover:bg-gray-500 hover:shadow-gray-400/50 hover:shadow-lg
                           focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
              >
                Retry Classification Drill
              </button>
            </div>
          </div>
        );
      case 'UNLOCK':
        return (
          <div className="text-center p-8 bg-gray-900 border-2 border-green-500 rounded-lg shadow-xl"
               style={{boxShadow: '0 0 20px #22c55e, 0 0 30px #16a34a inset'}}> {/* Enhanced green glow */}
            <h2 className="text-4xl font-bold text-green-300 mb-4" style={{textShadow: '0 0 10px #6ee7b7'}}>MODULE UNLOCKED!</h2>
            <p className="mb-6 text-xl text-green-200">
              Congratulations! Your high accuracy has unlocked the next phase.
            </p>
            <button
              onClick={() => send('RETURN_TO_VAULT')} // Changed event type for consistency
              className="px-8 py-4 font-extrabold rounded-lg shadow-lg transition-all duration-150 ease-out text-xl
                         bg-lime-500 text-gray-900 border-2 border-lime-300
                         hover:bg-lime-400 hover:shadow-lime-300/60 hover:shadow-xl
                         focus:outline-none focus:ring-2 focus:ring-lime-200 focus:ring-opacity-75"
            >
              Return to Vault {/* Changed button text */}
            </button>
          </div>
        );
      case 'NEXT':
        return (
          <div className="text-center p-8">
            <h2 className="text-3xl font-bold text-gray-400 mb-4">Mission Complete</h2>
            <p className="text-lg">You have completed the Classifier Construct module.</p>
            {/* Here you might have a button to go to a main menu or next conceptual part of the game */}
          </div>
        );
      default:
        return <p>Unknown state: {current.value.toString()}</p>;
    }
  };

  return <div className="classifier-module container mx-auto p-4">{renderContent()}</div>;
};

export default ClassifierModule;
