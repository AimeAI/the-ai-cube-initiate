# Snake³: The Axis Mind

![Snake³ Game](../assets/images/snake3-preview.png)

## Overview

Snake³: The Axis Mind is a 3D adaptation of the classic Snake game, designed as a free trial simulation for The AI Cube educational platform. Players navigate a snake through a 3D cube grid (8×8×8), collecting Data Nodes while avoiding collisions with the grid boundaries and the snake's own body.

## Unique Mechanics

- **3D Movement**: Navigate along X, Y, and Z axes in a three-dimensional space
- **Fading Tail**: Snake segments become invisible after 3 steps, adding a memory challenge
- **Dual Win Conditions**: Collect 10 Data Nodes or survive for 60 seconds
- **Voice Guidance**: Receive audio cues and guidance using the Web Speech API
- **Sacred Geometry**: Visual theme incorporating Metatron's Cube and Flower of Life patterns

## Technologies Used

- React with TypeScript
- React Three Fiber for 3D rendering
- Zustand for state management
- Web Speech API for voice guidance
- CSS for responsive styling

## Game Components

- **Snake3Game.jsx**: Main game component that sets up the React Three Fiber canvas
- **GridBoundary.jsx**: Renders the 8×8×8 cube grid with grid helpers
- **SacredGeometry.jsx**: Implements the sacred geometry visual theme
- **DataNode.jsx**: Renders collectible data nodes with particle effects
- **Snake.jsx**: Renders the player-controlled snake with fading tail mechanic
- **HUD.jsx**: Displays game information overlay (score, timer, etc.)
- **VoiceGuidance.jsx**: Implements voice announcements
- **gameStore.js**: Central state management using Zustand

## Controls

- **Keyboard**:
  - WASD / Arrow Keys: Move in X-Y plane
  - Q/E: Move up/down along Z-axis
  - Space: Pause/Resume
  - R: Reset game

- **Mobile**:
  - On-screen D-pad for X-Y movement
  - Up/Down buttons for Z-axis movement
  - Pause button

## Features

- Responsive design that works on desktop and mobile devices
- Accessibility features including high contrast mode and screen reader support
- Performance optimization with instanced rendering and adaptive quality
- Immersive 3D environment with dynamic lighting and particle effects
- Voice guidance for an enhanced gameplay experience

## Installation and Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
4. Open your browser and navigate to `http://localhost:3000`

## Integration with The AI Cube

Snake³: The Axis Mind is designed to be integrated into The AI Cube educational platform as a free trial simulation. It includes navigation to return to the main platform and consistent styling to maintain a cohesive user experience.

## Documentation

For more detailed information, refer to the following documentation:

- [Requirements](./01_requirements.md)
- [Domain Model](./02_domain_model.md)
- [Core Pseudocode](./03_pseudocode_core.md)
- [Rendering Pseudocode](./04_pseudocode_rendering.md)
- [Component Hierarchy](./05_component_hierarchy.md)
- [Implementation Guide](./06_implementation_guide.md)
- [Requirements Validation](./07_requirements_validation.md)

## License

This project is part of The AI Cube educational platform and is subject to its licensing terms.

## Credits

Developed as part of The AI Cube initiative to provide interactive educational experiences that blend technology, mathematics, and sacred geometry concepts.