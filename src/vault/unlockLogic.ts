// Step 2: Define Data Structures (Import/Reference)
// Assuming VaultData and ModuleProgress will be imported from vaultProgress.ts
// If they are in the same directory, direct import is fine.
// For now, defining them here for clarity, but can be changed to imports.

export interface ModuleProgress {
  moduleId: string;
  score: number;
  completed: boolean;
  timestamp: number;
  attempts: number;
  bestScore: number;
}

export interface VaultData {
  [moduleId: string]: ModuleProgress;
}

export interface ModuleConfig {
  id: string;
  name: string;
  description: string;
  unlocksRequired: string[]; // Array of module IDs
  minScoreToUnlock?: number | null; // Minimum score for the module itself, if this module is a prerequisite for another
                                    // OR minimum score *on the prerequisite modules*. The task implies the latter for checkUnlockStatus.
                                    // Let's assume minScoreToUnlock on a module config refers to the score needed *on its prerequisites*.
  icon: string;
  routePath: string;
}


// Step 3: Implement checkUnlockStatus() Function
export const checkUnlockStatus = (
  moduleIdToCheck: string,
  allModulesConfig: ModuleConfig[],
  currentProgress: VaultData
): boolean => {
  const moduleConfig = allModulesConfig.find(m => m.id === moduleIdToCheck);

  if (!moduleConfig) {
    console.error(`Configuration for module ID "${moduleIdToCheck}" not found.`);
    return false;
  }

  // If unlocksRequired is empty, the module is unlocked by default.
  if (!moduleConfig.unlocksRequired || moduleConfig.unlocksRequired.length === 0) {
    return true;
  }

  for (const requiredModuleId of moduleConfig.unlocksRequired) {
    const progress = currentProgress[requiredModuleId];

    // If progress for a required module does not exist or it's not completed, then locked.
    if (!progress || !progress.completed) {
      // console.log(`Module ${moduleIdToCheck} locked: Prerequisite ${requiredModuleId} not completed or no progress.`);
      return false;
    }

    // If the module being checked (moduleConfig) has a minScoreToUnlock defined for its prerequisites
    // This means each of its prerequisite modules must have been completed with at least this score.
    if (moduleConfig.minScoreToUnlock && moduleConfig.minScoreToUnlock > 0) {
      // Check the bestScore of the prerequisite module (progress object)
      if (!progress.bestScore || progress.bestScore < moduleConfig.minScoreToUnlock) {
        // console.log(`Module ${moduleIdToCheck} locked: Prerequisite ${requiredModuleId} best score (${progress.bestScore}) is less than required ${moduleConfig.minScoreToUnlock}.`);
        return false;
      }
    }
  }

  // All prerequisites are met
  return true;
};


// Step 4: Implement getUnlockableModules() Function
export const getUnlockableModules = (
  allModulesConfig: ModuleConfig[],
  currentProgress: VaultData
): Record<string, boolean> => {
  const unlockStatuses: Record<string, boolean> = {};

  for (const moduleConfig of allModulesConfig) {
    unlockStatuses[moduleConfig.id] = checkUnlockStatus(
      moduleConfig.id,
      allModulesConfig, // Pass the full config for potential cross-references if needed by checkUnlockStatus
      currentProgress
    );
  }

  return unlockStatuses;
};

// Example Usage (for testing purposes, can be removed or commented out)
/*
const exampleModules: ModuleConfig[] = [
  { id: "m1", name: "Module 1", description: "", unlocksRequired: [], icon: "", routePath: "" },
  { id: "m2", name: "Module 2", description: "", unlocksRequired: ["m1"], minScoreToUnlock: 70, icon: "", routePath: "" },
  { id: "m3", name: "Module 3", description: "", unlocksRequired: ["m1"], icon: "", routePath: "" }, // No min score for m1
  { id: "m4", name: "Module 4", description: "", unlocksRequired: ["m2", "m3"], minScoreToUnlock: 80, icon: "", routePath: "" },
  { id: "m5", name: "Module 5", description: "", unlocksRequired: ["mNonExistent"], icon: "", routePath: "" },
];

const exampleProgress: VaultData = {
  m1: { moduleId: "m1", score: 75, completed: true, timestamp: Date.now(), attempts: 1, bestScore: 75 },
  // m2 progress missing initially
  m3: { moduleId: "m3", score: 80, completed: true, timestamp: Date.now(), attempts: 1, bestScore: 80 },
};

console.log("--- Initial Unlock Statuses ---");
console.log(getUnlockableModules(exampleModules, exampleProgress));
// Expected: m1: true, m2: false (m1 score ok, but m2 needs m1 completed with score >= 70), m3: true, m4: false, m5: false

console.log("\n--- Checking m2 specifically ---");
console.log(`m2 unlocked? ${checkUnlockStatus("m2", exampleModules, exampleProgress)}`); // Expected: true (if m1 bestScore >= 70)

// Add progress for m2 to test m4
exampleProgress["m2"] = { moduleId: "m2", score: 85, completed: true, timestamp: Date.now(), attempts: 1, bestScore: 85 };
console.log("\n--- Unlock Statuses after m2 completion ---");
console.log(getUnlockableModules(exampleModules, exampleProgress));
// Expected: m1: true, m2: true, m3: true, m4: true (m2 bestScore 85 >= 80, m3 completed), m5: false

console.log("\n--- Checking m4 specifically (m2 score 85, m3 score 80, m4 needs 80 on prereqs) ---");
console.log(`m4 unlocked? ${checkUnlockStatus("m4", exampleModules, exampleProgress)}`); // Expected: true

// Scenario: m1 score drops below m2's minScoreToUnlock requirement
exampleProgress["m1"] = { moduleId: "m1", score: 60, completed: true, timestamp: Date.now(), attempts: 2, bestScore: 60 };
console.log("\n--- Unlock Statuses after m1 bestScore drops to 60 ---");
console.log(getUnlockableModules(exampleModules, exampleProgress));
// Expected: m1: true, m2: false (m1 bestScore 60 < 70), m3: true (no minScore for m1), m4: false (m2 now locked), m5: false

console.log("\n--- Checking m2 specifically (m1 bestScore 60) ---");
console.log(`m2 unlocked? ${checkUnlockStatus("m2", exampleModules, exampleProgress)}`); // Expected: false
*/
