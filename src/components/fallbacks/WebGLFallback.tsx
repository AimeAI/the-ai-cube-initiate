import React from 'react';

const WebGLFallback: React.FC = () => {
  const handleRetry = () => {
    // Attempt to reload or re-initialize the simulation
    window.location.reload(); 
  };

  return (
    <section
      role="region"
      aria-label="Simulation fallback"
      className="flex flex-col items-center justify-center h-full p-4 bg-gray-800 text-white"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">WebGL Not Available or Disabled</h2>
        <p className="mb-4">
          It seems your browser does not support WebGL, or it is disabled. 
          WebGL is required for the simulation to run.
        </p>
        <p className="mb-4">
          Please ensure WebGL is enabled in your browser settings, or try a different browser.
        </p>
        <button
          onClick={handleRetry}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-150 ease-in-out"
        >
          Retry Simulation
        </button>
        <div className="mt-6 text-sm text-gray-400">
          <h3 className="font-semibold mb-2">Keyboard Interaction Tips:</h3>
          <ul className="list-disc list-inside">
            <li>Use arrow keys for navigation if applicable.</li>
            <li>Press 'Space' or 'Enter' for primary actions.</li>
          </ul>
          {/* Optional: Animation Preview (e.g., a GIF or simple CSS animation) */}
          {/* <img src="/path/to/animation-preview.gif" alt="Animation preview" className="mt-4 rounded" /> */}
        </div>
      </div>
    </section>
  );
};

export default WebGLFallback;