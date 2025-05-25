import React, { useEffect, useState } from 'react';
import SacredButton from '@/components/sacred/SacredButton';
import CrystalCard from '@/components/sacred/CrystalCard';
import GeometricLoader from '@/components/sacred/GeometricLoader';
import { useNavigate } from 'react-router-dom';

const QuantumChamberGame: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const iframe = document.getElementById('game-iframe') as HTMLIFrameElement | null;
    if (iframe) {
      iframe.onload = () => {
        setIsLoading(false);
        // Optional: Send a message to the iframe if needed, e.g., to set up communication
        // iframe.contentWindow?.postMessage({ type: 'INIT_FROM_DASHBOARD', studentId: 'student123' }, '*');
      };
    }

    // Optional: Listen for messages from the iframe (e.g., game completion, score updates)
    const handleMessage = (event: MessageEvent) => {
      // IMPORTANT: Check event.origin for security if the iframe is from a different domain
      // if (event.origin !== 'expected-iframe-origin') return;

      if (event.data && event.data.type === 'GAME_EVENT') {
        console.log('Event from Quantum Chamber:', event.data.payload);
        // Example: Update student progress based on event.data.payload
        // updateStudentProgress('quantum-chamber', event.data.payload.level, event.data.payload.score);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-void-black p-4">
      <CrystalCard className="w-full max-w-6xl h-[calc(100vh-12rem)] flex flex-col items-center justify-center shadow-xl shadow-cyan-500/30">
        <h1 className="text-4xl font-orbitron text-cyan-400 mb-6 text-center sacred-text-glow">
          Quantum Chamber
        </h1>
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-void-black/80 z-10">
            <GeometricLoader />
            <p className="text-xl text-crystal-white mt-4 font-orbitron">Awakening Quantum Fields...</p>
          </div>
        )}
        <iframe
          id="game-iframe"
          src="/games/quantum-chamber/index.html"
          title="Quantum Chamber Game"
          className="w-full h-full border-2 border-cyan-500/50 rounded-lg shadow-inner shadow-blue-500/50"
          allow="fullscreen"
          sandbox="allow-scripts allow-same-origin" // Security: restrict iframe capabilities
          onLoad={() => setIsLoading(false)} // Fallback if useEffect's onload doesn't fire first
        />
        <SacredButton 
          onClick={() => navigate('/student-dashboard')} 
          className="mt-6"
          variant="secondary"
        >
          Return to Dashboard
        </SacredButton>
      </CrystalCard>
    </div>
  );
};

export default QuantumChamberGame;