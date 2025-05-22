import { createMachine, assign } from 'xstate';

import { saveProgress } from '../vault/vaultProgress'; // Import saveProgress

// Define the completion threshold
const CLASSIFIER_COMPLETION_THRESHOLD = 0.70; // 70% accuracy

// Define the context for the machine (if any data needs to be stored)
export interface ClassifierMachineContext {
  accuracy: number; // Stores the accuracy of the last completed session
  classificationsMade: number; // Total classifications made across all sessions (conceptual for now, not fully used)
  attemptsInSession: number; // Number of classifications in the current session
}

// Define the events that can be sent to the machine
export type ClassifierMachineEvent =
  | { type: 'START_MISSION' }
  | { type: 'CLASSIFICATION_COMPLETE'; accuracy: number; attemptsMade: number }
  | { type: 'CONTINUE_TO_REPORT' }
  | { type: 'VIEW_IMPACT' } 
  | { type: 'RETRY_LEVEL' }
  | { type: 'PROCEED_TO_NEXT' }
  | { type: 'RETURN_TO_VAULT' }; // New event

// Define actions for the machine
// (Action implementations are in the component, these are just names for the machine config)
export interface ClassifierMachineActions {
  speakIntro: () => void;
  triggerReturnToVault: () => void; // New action name
}


// Define the states and their transitions
export const classifierMachine = createMachine<
  ClassifierMachineContext,
  ClassifierMachineEvent
  // Omitting specific actions type from createMachine generic for simplicity with inline actions,
  // but you could define it if you have many shared actions.
>({
  id: 'classifierConstruct',
  initial: 'INTRO',
  context: {
    accuracy: 0,
    classificationsMade: 0, // Initial value, might be loaded or tracked differently later
    attemptsInSession: 0,
  },
  states: {
    INTRO: {
      entry: ['logIntroEntry', 'speakIntroAction'],
      on: {
        START_MISSION: 'INTERACT',
      },
    },
    INTERACT: {
      entry: [
        () => console.log('State: INTERACT'),
        // Reset attemptsInSession when starting a new interaction session
        assign({ attemptsInSession: 0 }) 
      ],
      on: {
        CLASSIFICATION_COMPLETE: {
          target: 'FEEDBACK',
          actions: assign((context, event) => {
            const { accuracy, attemptsMade } = event;
            const completed = accuracy >= CLASSIFIER_COMPLETION_THRESHOLD;

            console.log(`Classification complete. Accuracy: ${accuracy}, Attempts: ${attemptsMade}, Completed: ${completed}`);
            
            const saveResult = saveProgress({
              moduleId: 'classifierConstruct',
              score: accuracy, // Save accuracy as score (e.g., 0.85)
              completed: completed,
              attempts: attemptsMade, // Number of attempts in this specific session
            });
            console.log('saveProgress result:', saveResult ? 'Success' : 'Failure');

            return {
              ...context,
              accuracy: accuracy, // Update context with session accuracy
              attemptsInSession: attemptsMade,
              // classificationsMade could be updated here if it means total across all vault progress
            };
          }),
        },
      },
    },
    FEEDBACK: {
      entry: () => console.log('State: FEEDBACK'),
      on: {
        CONTINUE_TO_REPORT: 'REPORT',
      },
    },
    REPORT: {
      entry: () => console.log('State: REPORT'),
      on: {
        // Conditional transition based on accuracy (VIEW_IMPACT could be simplified or removed if RETURN_TO_VAULT handles all exits)
        VIEW_IMPACT: [ // This path is now less likely to be the primary exit.
          { target: 'UNLOCK', cond: (context) => context.accuracy >= CLASSIFIER_COMPLETION_THRESHOLD },
          { target: 'INTERACT' }, 
        ],
        RETRY_LEVEL: 'INTERACT', 
        // PROCEED_TO_NEXT: 'NEXT', // This can be removed if RETURN_TO_VAULT is the main exit
        RETURN_TO_VAULT: {
          actions: ['triggerReturnToVault'], // Execute the action
          target: 'INTRO', // Loop back to INTRO, ready for next session if module is re-selected
        }
      },
    },
    UNLOCK: {
      entry: () => console.log('State: UNLOCK - Module Unlocked!'),
      on: {
        // PROCEED_TO_NEXT: 'NEXT', // Can be replaced by RETURN_TO_VAULT from UI if desired
        // Or, this state could also have a RETURN_TO_VAULT transition
        RETURN_TO_VAULT: { // Allowing return from UNLOCK state as well
            actions: ['triggerReturnToVault'],
            target: 'INTRO',
        }
      },
    },
    NEXT: { // This state might become obsolete or repurposed if RETURN_TO_VAULT handles all exits.
            // For now, keeping it but it might not be reachable if PROCEED_TO_NEXT is removed from REPORT.
      type: 'final', 
      entry: () => console.log('State: NEXT - Module session ended (potentially transitioning via Vault).'),
    },
  },
});
