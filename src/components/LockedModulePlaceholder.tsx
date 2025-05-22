import React from 'react';
import { ShieldAlert } from 'lucide-react'; // Using a relevant icon

interface LockedModulePlaceholderProps {
  moduleName: string;
}

const LockedModulePlaceholder: React.FC<LockedModulePlaceholderProps> = ({ moduleName }) => {
  return (
    <div 
      className="
        p-6 bg-gray-800 border-2 border-red-700 rounded-lg shadow-xl 
        text-center text-gray-400 cursor-not-allowed select-none
        opacity-75 hover:opacity-90 transition-opacity duration-300
      "
      style={{ pointerEvents: 'none' }} // Disable clicks at the component level
    >
      <div className="flex flex-col items-center">
        <ShieldAlert size={48} className="text-red-500 mb-4" />
        <h3 className="text-2xl font-bold text-red-400 mb-2">{moduleName}</h3>
        <p className="text-lg font-semibold text-yellow-500">Phase 2 Clearance Required</p>
        <p className="text-md italic mt-1 text-gray-500">"Pattern Detected — But Not Understood"</p>
      </div>
    </div>
  );
};

export default LockedModulePlaceholder;
