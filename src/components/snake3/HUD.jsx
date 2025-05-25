import React from 'react';
import { useGameStore } from '../../store/gameStore';

/**
 * HUD Component
 * 
 * Displays game information overlay for the Snake³ game.
 * Shows data node counter, timer, score, and current movement direction.
 */
function HUD() {
  // Get game state from store
  const {
    score,
    nodesCollected,
    elapsedTime,
    isPaused,
    isGameOver,
    isVictory,
    snake
  } = useGameStore();
  
  // Format time as mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Get direction name for display
  const getDirectionName = (direction) => {
    if (direction.x === 1) return "Right";
    if (direction.x === -1) return "Left";
    if (direction.y === 1) return "Up";
    if (direction.y === -1) return "Down";
    if (direction.z === 1) return "Forward";
    if (direction.z === -1) return "Backward";
    return "None";
  };
  
  return (
    <div className="hud-container">
      {/* Main HUD */}
      <div className="hud">
        {/* Data node counter */}
        <div className="data-node-counter">
          <span className="label">Data Nodes:</span>
          <span className="value">{nodesCollected}/10</span>
        </div>
        
        {/* Timer */}
        <div className="timer">
          <span className="label">Time:</span>
          <span className="value">{formatTime(elapsedTime)}</span>
        </div>
        
        {/* Score */}
        <div className="score">
          <span className="label">Score:</span>
          <span className="value">{score}</span>
        </div>
        
        {/* Current axis indicator */}
        <div className="axis-indicator">
          <span className="label">Moving:</span>
          <span className="value">{getDirectionName(snake.direction)}</span>
        </div>
      </div>
      
      {/* Game state screens */}
      {isPaused && <PauseScreen />}
      {isGameOver && <GameOverScreen />}
      {isVictory && <VictoryScreen />}
      
      {/* Controls help */}
      <ControlsHelp />
    </div>
  );
}

/**
 * PauseScreen Component
 * 
 * Displayed when the game is paused.
 */
function PauseScreen() {
  const { togglePause, resetGame } = useGameStore();
  
  return (
    <div className="overlay pause-screen">
      <h2>Game Paused</h2>
      <p>Press ESC or P to resume</p>
      
      {/* Settings */}
      <div className="settings">
        <h3>Settings</h3>
        <div className="setting">
          <label>Game Speed:</label>
          <input 
            type="range" 
            min="1" 
            max="10" 
            defaultValue="5"
            onChange={(e) => updateGameSpeed(parseInt(e.target.value))}
          />
        </div>
        <div className="setting">
          <label>Voice Guidance:</label>
          <input 
            type="checkbox" 
            defaultChecked={true}
            onChange={(e) => toggleVoiceGuidance(e.target.checked)}
          />
        </div>
        <div className="setting">
          <label>High Contrast:</label>
          <input 
            type="checkbox" 
            defaultChecked={false}
            onChange={(e) => toggleHighContrast(e.target.checked)}
          />
        </div>
      </div>
      
      <button onClick={togglePause}>Resume</button>
      <button onClick={resetGame}>Restart</button>
    </div>
  );
}

/**
 * GameOverScreen Component
 * 
 * Displayed when the game is over due to collision.
 */
function GameOverScreen() {
  const { nodesCollected, score, elapsedTime, resetGame } = useGameStore();
  
  return (
    <div className="overlay game-over-screen">
      <h2>Game Over</h2>
      <p>You collected {nodesCollected} data nodes</p>
      <p>Your score: {score}</p>
      <p>Time survived: {formatTime(elapsedTime)}</p>
      
      <button onClick={resetGame}>Play Again</button>
    </div>
  );
}

/**
 * VictoryScreen Component
 * 
 * Displayed when the player wins by collecting all nodes or surviving.
 */
function VictoryScreen() {
  const { victoryType, score, elapsedTime, resetGame } = useGameStore();
  
  return (
    <div className="overlay victory-screen">
      <h2>Victory!</h2>
      <p>
        {victoryType === "collection" 
          ? "You collected all 10 data nodes!" 
          : "You survived for 60 seconds!"}
      </p>
      <p>Your score: {score}</p>
      <p>Time: {formatTime(elapsedTime)}</p>
      
      <button onClick={resetGame}>Play Again</button>
    </div>
  );
}

/**
 * ControlsHelp Component
 * 
 * Displays control instructions.
 */
function ControlsHelp() {
  return (
    <div className="controls-help">
      <h3>Controls</h3>
      <ul>
        <li>W/↑: Move Up</li>
        <li>A/←: Move Left</li>
        <li>S/↓: Move Down</li>
        <li>D/→: Move Right</li>
        <li>Q: Move Backward (Z-axis)</li>
        <li>E: Move Forward (Z-axis)</li>
        <li>ESC/P: Pause Game</li>
      </ul>
    </div>
  );
}

// Helper function for formatting time
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Placeholder functions for settings
const updateGameSpeed = (speed) => {
  // Will be implemented in game store
  console.log(`Setting game speed to ${speed}`);
};

const toggleVoiceGuidance = (enabled) => {
  // Will be implemented in game store
  console.log(`Setting voice guidance to ${enabled}`);
};

const toggleHighContrast = (enabled) => {
  // Will be implemented in game store
  console.log(`Setting high contrast to ${enabled}`);
};

export default HUD;