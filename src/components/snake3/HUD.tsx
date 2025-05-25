import React from 'react';

interface HUDProps {
  score: number;
  dataNodesCollected: number; // Assuming score might be different from nodes collected
  timeLeft: number; // Or timeElapsed, depending on win condition
}

const HUD: React.FC<HUDProps> = ({ score, dataNodesCollected, timeLeft }) => {
  return (
    <div 
      style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        color: 'white',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: '10px',
        borderRadius: '5px',
        fontFamily: 'Arial, sans-serif',
        zIndex: 100, // Ensure HUD is on top
      }}
    >
      <div>Score: {score}</div>
      <div>Data Nodes: {dataNodesCollected} / 10</div>
      <div>Time: {timeLeft}s</div> {/* Assuming timeLeft is in seconds */}
    </div>
  );
};

export default HUD;