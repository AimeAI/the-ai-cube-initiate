import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

const PhaserGame: React.FC = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
import { ClassifierScene } from '../phaser/scenes/ClassifierScene'; // Import the new scene

const PhaserGame: React.FC = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (gameContainerRef.current && !gameRef.current) {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        parent: gameContainerRef.current,
        width: 800,
        height: 600,
        scene: [ClassifierScene], // Use the new ClassifierScene
        // physics: { // Optional: Add physics if needed later
        //   default: 'arcade',
        //   arcade: {
        //     gravity: { y: 0 },
        //   },
        // },
      };

      gameRef.current = new Phaser.Game(config);
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div 
      id="phaser-game-container" 
      ref={gameContainerRef} 
      className="
        border-2 border-blue-500 rounded-lg shadow-lg 
        overflow-hidden 
        bg-gray-900 
        mx-auto
      "
      style={{ 
        width: '800px', // Match Phaser game config width
        height: '600px', // Match Phaser game config height
        boxShadow: '0 0 15px rgba(0, 128, 255, 0.5), 0 0 30px rgba(0, 128, 255, 0.3)', // Neon blue glow
      }}
    />
  );
};

export default PhaserGame;
