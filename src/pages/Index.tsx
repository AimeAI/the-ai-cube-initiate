
import React, { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import React, { useEffect, useState } from 'react'; // Added useState
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import AccessSection from '@/components/AccessSection';
import CoreSection from '@/components/CoreSection';
import VaultGrid from '@/components/vault/VaultGrid'; // Import VaultGrid
// ClassifierModule and LockedModulePlaceholder will be handled by VaultGrid's logic or a subsequent step

// ClassifierModule and LockedModulePlaceholder will be handled by VaultGrid's logic or a subsequent step
// Removed direct import of ClassifierModule here as it's handled in the conditional rendering
// Removed direct import of LockedModulePlaceholder as it's no longer used

const Index: React.FC = () => {
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [selectedModuleName, setSelectedModuleName] = useState<string | null>(null); // Store module name

  useEffect(() => {
    // Set dark background
    document.body.style.background = '#000000';
    
    return () => {
      document.body.style.background = '';
    };
  }, []);

  const handleModuleSelect = (moduleId: string, moduleName: string) => { // Updated signature
    console.log(`Module selected in Index.tsx: ${moduleId} (${moduleName})`);
    setSelectedModuleId(moduleId);
    setSelectedModuleName(moduleName);
  };
  
  const handleReturnToVault = () => {
    setSelectedModuleId(null);
    setSelectedModuleName(null);
  };

  // Dynamically import ClassifierModule to avoid circular dependency issues if any,
  // and to potentially code-split later if needed.
  // For now, direct import is fine if no issues, but this pattern is robust.
  const ClassifierModule = React.lazy(() => import('@/components/ClassifierModule'));


  return (
    <div className="bg-black text-white min-h-screen overflow-x-hidden">
      <Navigation />
      
      {/* Conditionally render sections OR the VaultGrid/Selected Module */}
      {!selectedModuleId ? ( 
        <>
          <HeroSection />
          <AccessSection />
          <CoreSection />
          <VaultGrid onModuleSelect={handleModuleSelect} />
        </>
      ) : selectedModuleId === 'classifierConstruct' ? (
        <React.Suspense fallback={<div className="text-center p-10 text-cyan-400">Loading Classifier Construct...</div>}>
          <ClassifierModule onModuleComplete={handleReturnToVault} />
        </React.Suspense>
      ) : (
        // Placeholder for other selected modules
        <div className="text-center py-20 flex flex-col items-center justify-center min-h-[calc(100vh-100px)]"> {/* Adjust min-h as needed */}
          <h2 className="text-3xl font-bold text-yellow-400 mb-4">
            Module Selected: <span className="text-yellow-200">{selectedModuleName || selectedModuleId}</span>
          </h2>
          <p className="text-lg text-gray-300 mb-6">
            This module is unlocked and selected. Module content coming soon!
          </p>
          <button 
            onClick={handleReturnToVault} 
            className="px-6 py-3 font-bold rounded-lg shadow-md transition-all duration-150 ease-out
                       bg-blue-600 text-white border-2 border-blue-400
                       hover:bg-blue-500 hover:shadow-blue-400/50 hover:shadow-lg
                       focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
          >
            Back to Vault
          </button>
        </div>
      )}
      
      {/* More sections to be added later if they are universal */}
    </div>
  );
};

export default Index;
