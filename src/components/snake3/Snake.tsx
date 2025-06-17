import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box } from '@react-three/drei';
import * as THREE from 'three';
import type { Direction as VoiceDirectionType } from './VoiceGuidance'; // Import the Direction type

interface SnakeSegmentProps {
  position: [number, number, number];
  isHead?: boolean;
  visible?: boolean;
}

const SnakeSegment: React.FC<SnakeSegmentProps> = ({ position, isHead = false, visible = true }) => {
  if (!visible) {
    return null;
  }
  return (
    <Box args={[0.8, 0.8, 0.8]} position={position}>
      <meshStandardMaterial color={isHead ? 'lightgreen' : 'green'} />
    </Box>
  );
};

interface SnakeProps {
  initialPosition?: [number, number, number];
  onCollectDataNode: () => void;
  dataNodePosition: [number, number, number];
  isGrowing: boolean;
  setIsGrowing: React.Dispatch<React.SetStateAction<boolean>>;
  onGameOver: () => void;
  setCurrentDirection?: React.Dispatch<React.SetStateAction<VoiceDirectionType | null>>; // Add setCurrentDirection prop
}

type InternalDirection = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'FORWARD' | 'BACKWARD'; // Renamed to avoid conflict
const GRID_SIZE = 8;

const SNAKE_SPEED = 5; // Moves 1 unit every 1/5th of a second (200ms)

const Snake: React.FC<SnakeProps> = (props) => {
  const {
    initialPosition: initialPosFromProps = [3.5, 3.5, 3.5],
    onCollectDataNode,
    dataNodePosition,
    isGrowing,
    setIsGrowing,
    onGameOver,
    setCurrentDirection // Destructure setCurrentDirection
  } = props;

  const [segments, setSegments] = useState<Array<[number, number, number]>>([initialPosFromProps]);
  const [direction, setDirection] = useState<InternalDirection>('RIGHT'); // Use InternalDirection
  const [lastMoveTime, setLastMoveTime] = useState(0);
  const directionRef = useRef<InternalDirection>(direction); // Use InternalDirection
  // Removed duplicate declarations that were here

  useEffect(() => {
    directionRef.current = direction;
    if (setCurrentDirection) {
      setCurrentDirection(direction as VoiceDirectionType); // Update parent state for voice
    }
  }, [direction, setCurrentDirection]);

  // No need for segmentsRef anymore as setSegments callback will have the latest state.

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const newDirection = directionRef.current;
      let proposedDirection: InternalDirection | null = null; // Use InternalDirection

      switch (event.key.toLowerCase()) {
        case 'w': // Forward in Y
          if (newDirection !== 'DOWN') proposedDirection = 'UP';
          break;
        case 's': // Backward in Y
          if (newDirection !== 'UP') proposedDirection = 'DOWN';
          break;
        case 'a': // Left in X
          if (newDirection !== 'RIGHT') proposedDirection = 'LEFT';
          break;
        case 'd': // Right in X
          if (newDirection !== 'LEFT') proposedDirection = 'RIGHT';
          break;
        case 'q': // Down in Z
          if (newDirection !== 'FORWARD') proposedDirection = 'BACKWARD';
          break;
        case 'e': // Up in Z
          if (newDirection !== 'BACKWARD') proposedDirection = 'FORWARD';
          break;
        default:
          break;
      }

      if (proposedDirection) {
        setDirection(proposedDirection);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useFrame((state, delta) => {
    if (state.clock.elapsedTime - lastMoveTime > 1 / SNAKE_SPEED) {
      setSegments(prevSegments => {
        // Calculate the new head position based on the current direction
        const newHeadPositionCalculated = [...prevSegments[0]] as [number, number, number];
        switch (directionRef.current) {
          case 'UP': newHeadPositionCalculated[1] += 1; break;
          case 'DOWN': newHeadPositionCalculated[1] -= 1; break;
          case 'LEFT': newHeadPositionCalculated[0] -= 1; break;
          case 'RIGHT': newHeadPositionCalculated[0] += 1; break;
          case 'FORWARD': newHeadPositionCalculated[2] += 1; break;
          case 'BACKWARD': newHeadPositionCalculated[2] -= 1; break;
        }

        // Collision with DataNode
        if (
          newHeadPositionCalculated[0] === dataNodePosition[0] &&
          newHeadPositionCalculated[1] === dataNodePosition[1] &&
          newHeadPositionCalculated[2] === dataNodePosition[2]
        ) {
          onCollectDataNode(); // This will trigger setIsGrowing(true) in Snake3Game
        }

        // Boundary Collision Check
        if (
          newHeadPositionCalculated[0] < 0 || newHeadPositionCalculated[0] >= GRID_SIZE ||
          newHeadPositionCalculated[1] < 0 || newHeadPositionCalculated[1] >= GRID_SIZE ||
          newHeadPositionCalculated[2] < 0 || newHeadPositionCalculated[2] >= GRID_SIZE
        ) {
          onGameOver();
          return prevSegments; // Keep snake as is, game over handled by parent
        }

        // Self Collision Check (excluding the very last segment if not growing, as it will be removed)
        const checkSegments = [...prevSegments];
        if (!isGrowing && checkSegments.length > 1) {
            // If not growing, the actual tail that can be collided with is all but the last one
            // because the last one will be removed in this move.
            // However, if the snake is very short (e.g. 2 segments), it can still collide with its "future" tail.
            // For simplicity now, check against all current segments except the head.
            // A more precise check would be against `newSegments` before `pop`.
        }

        for (let i = 0; i < checkSegments.length - (isGrowing ? 0 : 1) ; i++) {
          const segment = checkSegments[i];
          if (
            newHeadPositionCalculated[0] === segment[0] &&
            newHeadPositionCalculated[1] === segment[1] &&
            newHeadPositionCalculated[2] === segment[2]
          ) {
            onGameOver();
            return prevSegments; // Keep snake as is
          }
        }


        // Add the new head to the beginning of the segments array
        const newSegments = [newHeadPositionCalculated, ...prevSegments];

        // If the snake is not growing, remove the tail segment
        if (!isGrowing) {
          newSegments.pop();
        }
        
        // Reset growth state (parent will set isGrowing to false after this update)
        if (isGrowing && setIsGrowing) { // setIsGrowing is passed from parent
            // The parent (Snake3Game) should ideally reset this after processing the growth.
            // For now, we assume the parent handles resetting isGrowing to false.
            // setIsGrowing(false); // This would cause an immediate re-render if called here.
        }
        
        return newSegments;
      });
      setLastMoveTime(state.clock.elapsedTime);
    }
  });

  // Removed placeholder growth test useEffect

  return (
    <>
      {segments.map((pos, index) => (
        <SnakeSegment
          key={index}
          position={pos}
          isHead={index === 0}
          visible={index < 3} // Only head + first 2 tail segments are visible
        />
      ))}
    </>
  );
};

export default Snake;