// Step 2: Define Data Structures (Interfaces)
export interface ModuleProgress {
  moduleId: string;
  score: number; // Score for the last attempt/session
  completed: boolean; // Whether the module was successfully completed in the last attempt
  timestamp: number; // Timestamp of the last update
  attempts: number; // Total attempts for this module across all sessions
  bestScore: number; // Highest score achieved for this module
}

export interface VaultData {
  [moduleId: string]: ModuleProgress;
}

// Step 3: Implement Obfuscation/De-obfuscation Functions
const obfuscateData = (data: string): string => {
  try {
    return btoa(data); // Base64 encoding
  } catch (error) {
    console.error("Error during data obfuscation (btoa):", error);
    return ""; // Return empty string or handle as appropriate
  }
};

const deobfuscateData = (obfuscatedData: string): string => {
  try {
    return atob(obfuscatedData); // Base64 decoding
  } catch (error) {
    console.error("Error during data de-obfuscation (atob):", error);
    // Could be due to corrupted data or not valid Base64
    return ""; // Return empty string or throw, depending on desired error handling
  }
};

const VAULT_STORAGE_KEY = 'vaultProgressData';

// Step 4: Implement loadProgress() Function
export const loadProgress = (): VaultData => {
  try {
    const obfuscatedProgress = localStorage.getItem(VAULT_STORAGE_KEY);
    if (!obfuscatedProgress) {
      return {};
    }

    const jsonProgress = deobfuscateData(obfuscatedProgress);
    if (!jsonProgress) {
      // Deobfuscation failed (error already logged by deobfuscateData)
      return {};
    }

    const parsedProgress: VaultData = JSON.parse(jsonProgress);
    return parsedProgress;
  } catch (error) {
    console.error("Error loading progress from localStorage:", error);
    // Could be parsing error or other localStorage access issues
    return {};
  }
};

// Step 5: Implement saveProgress() Function
export type ModuleSessionResult = {
  moduleId: string;
  score: number; // Score for the current session/attempt
  completed: boolean;
  attempts: number; // Attempts made in the current session
};

export const saveProgress = (moduleSessionResult: ModuleSessionResult): boolean => {
  try {
    const currentVaultData = loadProgress(); // Load existing full progress

    const existingModuleProgress = currentVaultData[moduleSessionResult.moduleId];

    const totalAttempts = (existingModuleProgress?.attempts || 0) + moduleSessionResult.attempts;
    
    let bestScore = existingModuleProgress?.bestScore || 0;
    if (moduleSessionResult.score > bestScore) {
      bestScore = moduleSessionResult.score;
    }
    
    // If module didn't exist, or current score is better, it's the new bestScore
    // Also handles the case where bestScore was undefined initially
    if (!existingModuleProgress || moduleSessionResult.score > (existingModuleProgress.bestScore || 0)) {
        bestScore = moduleSessionResult.score;
    } else {
        bestScore = existingModuleProgress.bestScore;
    }


    const updatedModuleProgress: ModuleProgress = {
      moduleId: moduleSessionResult.moduleId,
      score: moduleSessionResult.score,
      completed: moduleSessionResult.completed,
      timestamp: Date.now(),
      attempts: totalAttempts, // Sum of previous and current session's attempts
      bestScore: bestScore,
    };

    currentVaultData[moduleSessionResult.moduleId] = updatedModuleProgress;

    const jsonVaultData = JSON.stringify(currentVaultData);
    const obfuscatedVaultData = obfuscateData(jsonVaultData);

    if (!obfuscatedVaultData && jsonVaultData) { // Check if obfuscation failed but had data
        console.error("Failed to save progress due to obfuscation error.");
        return false;
    }
    
    localStorage.setItem(VAULT_STORAGE_KEY, obfuscatedVaultData);
    return true;
  } catch (error) {
    console.error("Error saving progress to localStorage:", error);
    // Could be quota exceeded or other localStorage issues
    return false;
  }
};

// Step 6: Implement getModuleProgress() Function
export const getModuleProgress = (moduleId: string): ModuleProgress | undefined => {
  const vaultData = loadProgress();
  return vaultData[moduleId];
};

// Example Usage (for testing purposes, can be removed or commented out)
/*
console.log("Initial load:", loadProgress());

saveProgress({ moduleId: "classifierConstruct", score: 75, completed: true, attempts: 1 });
console.log("After saving CC (75):", getModuleProgress("classifierConstruct"));

saveProgress({ moduleId: "classifierConstruct", score: 80, completed: true, attempts: 1 });
console.log("After saving CC (80):", getModuleProgress("classifierConstruct"));

saveProgress({ moduleId: "classifierConstruct", score: 70, completed: false, attempts: 1 });
console.log("After saving CC (70):", getModuleProgress("classifierConstruct"));

saveProgress({ moduleId: "predictorEngine", score: 90, completed: true, attempts: 2 });
console.log("After saving PE (90):", getModuleProgress("predictorEngine"));

console.log("Final vault data:", loadProgress());
*/
