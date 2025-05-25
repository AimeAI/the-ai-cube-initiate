# Snake³: The Axis Mind - Domain Model

## 1. Core Entities

### 1.1 Position
Represents a discrete point in the 3D grid.

```
Position {
  x: number  // X-coordinate (0-7)
  y: number  // Y-coordinate (0-7)
  z: number  // Z-coordinate (0-7)
}
```

#### Validation Rules:
- All coordinates must be integers between 0 and 7 (inclusive)
- Position must be within the 8×8×8 grid boundaries

#### Operations:
- equals(other: Position): boolean
- isWithinBounds(): boolean
- toString(): string

### 1.2 Direction
Represents the direction of movement along the three axes.

```
Direction {
  x: number  // X-axis direction (-1, 0, 1)
  y: number  // Y-axis direction (-1, 0, 1)
  z: number  // Z-axis direction (-1, 0, 1)
}
```

#### Constants:
- UP: Direction = { x: 0, y: 1, z: 0 }
- DOWN: Direction = { x: 0, y: -1, z: 0 }
- LEFT: Direction = { x: -1, y: 0, z: 0 }
- RIGHT: Direction = { x: 1, y: 0, z: 0 }
- FORWARD: Direction = { x: 0, y: 0, z: 1 }
- BACKWARD: Direction = { x: 0, y: 0, z: -1 }

#### Validation Rules:
- Only one axis can have a non-zero value at any time
- Non-zero values must be either -1 or 1

#### Operations:
- isOpposite(other: Direction): boolean
- toString(): string

### 1.3 SnakeSegment
Represents a segment of the snake's body.

```
SnakeSegment {
  position: Position
  isVisible: boolean
  index: number  // Position in the snake (0 for head)
}
```

#### Validation Rules:
- Index must be a non-negative integer
- Head segment (index 0) must always be visible

### 1.4 Snake
Represents the player-controlled snake entity.

```
Snake {
  segments: SnakeSegment[]
  direction: Direction
  nextDirection: Direction
  growthPending: number
  visibleSegmentCount: number  // Number of segments that remain visible (default: 3)
}
```

#### Operations:
- move(): void
- grow(amount: number): void
- changeDirection(newDirection: Direction): boolean
- getHead(): SnakeSegment
- getTail(): SnakeSegment[]
- containsPosition(position: Position): boolean
- isCollidingWithSelf(): boolean
- isCollidingWithBoundary(): boolean

### 1.5 DataNode
Represents a collectible item in the game.

```
DataNode {
  position: Position
  value: number  // Points awarded for collection
  effect: NodeEffect  // Special effect (if any)
}
```

#### Operations:
- spawn(availablePositions: Position[]): void
- isCollectedBy(snake: Snake): boolean

### 1.6 NodeEffect
Represents special effects that can be applied when collecting a DataNode.

```
NodeEffect {
  type: string  // "SPEED", "GROWTH", "VISIBILITY", etc.
  magnitude: number
  duration: number  // In seconds, 0 for permanent
}
```

### 1.7 GameState
Represents the current state of the game.

```
GameState {
  snake: Snake
  dataNode: DataNode
  score: number
  nodesCollected: number
  elapsedTime: number  // In seconds
  gameSpeed: number  // Movement speed
  isPaused: boolean
  isGameOver: boolean
  isVictory: boolean
  victoryType: string  // "COLLECTION" or "SURVIVAL"
}
```

#### State Transitions:
- INIT → PLAYING: Game starts
- PLAYING → PAUSED: Player pauses game
- PAUSED → PLAYING: Player resumes game
- PLAYING → GAME_OVER: Snake collides with boundary or itself
- PLAYING → VICTORY: Player collects 10 nodes or survives for 60 seconds

#### Operations:
- start(): void
- pause(): void
- resume(): void
- update(deltaTime: number): void
- handleInput(key: string): void
- checkCollisions(): void
- checkWinConditions(): void
- reset(): void

### 1.8 VoiceGuidance
Manages speech synthesis for game feedback.

```
VoiceGuidance {
  isSpeaking: boolean
  queue: string[]
  volume: number
  rate: number
  pitch: number
  voice: SpeechSynthesisVoice
}
```

#### Operations:
- speak(message: string, priority: boolean): void
- announceDirection(direction: Direction): void
- announceGameState(state: string): void
- announceCollection(): void
- announceWarning(type: string): void
- stop(): void
- setVoice(voice: SpeechSynthesisVoice): void
- setVolume(volume: number): void

## 2. Relationships

### 2.1 Entity Relationships

1. **Snake → SnakeSegment**: Composition
   - A Snake consists of multiple SnakeSegments
   - The first segment (index 0) is the head
   - Segments follow the head's previous positions

2. **Snake → Direction**: Association
   - A Snake has a current direction of movement
   - A Snake has a pending next direction (for next update)

3. **SnakeSegment → Position**: Composition
   - Each SnakeSegment has a Position in the 3D grid

4. **DataNode → Position**: Composition
   - Each DataNode has a Position in the 3D grid

5. **DataNode → NodeEffect**: Association
   - A DataNode may have a special effect

6. **GameState → Snake**: Composition
   - GameState manages a single Snake instance

7. **GameState → DataNode**: Composition
   - GameState manages a single active DataNode

8. **GameState → VoiceGuidance**: Association
   - GameState uses VoiceGuidance for audio feedback

## 3. State Management

### 3.1 Game Loop State Flow

```
Initialize GameState
  ↓
Start Game
  ↓
┌─────────────────────┐
│ Game Loop           │
│  ↓                  │
│ Process Input       │
│  ↓                  │
│ Update Game State   │
│  ↓                  │
│ Check Collisions    │
│  ↓                  │
│ Check Win Conditions│
│  ↓                  │
│ Render Scene        │
└─────────┬───────────┘
          ↓
    Game Over or Victory
```

### 3.2 Input Handling State Flow

```
Key Press Detected
  ↓
Determine Input Type
  ↓
┌─────────────┬───────────────┬─────────────┐
│             │               │             │
↓             ↓               ↓             ↓
Movement    Z-Axis         Pause         Restart
Direction   Movement        Game          Game
  ↓             ↓               ↓             ↓
Update      Update          Toggle        Reset
Direction   Direction        Pause        GameState
```

### 3.3 Collision Detection Flow

```
Check Collisions
  ↓
┌────────────────┬────────────────┐
│                │                │
↓                ↓                ↓
Check Boundary  Check Self      Check DataNode
Collision       Collision       Collection
  ↓                ↓                ↓
If Collision    If Collision    If Collection
  ↓                ↓                ↓
Game Over       Game Over       Process Collection
```

## 4. Data Structures

### 4.1 Grid Representation

The 8×8×8 grid is conceptually represented as a three-dimensional array, but for performance reasons, positions are stored and compared directly rather than maintaining a full 3D array.

### 4.2 Movement History

The snake's movement history is implicitly stored in the positions of its segments. Each segment follows the path taken by the segment in front of it.

### 4.3 Collision Detection

Collision detection uses direct position comparison rather than grid cell occupancy:
- Boundary collisions: Check if position coordinates are outside 0-7 range
- Self collisions: Check if head position matches any tail segment position
- DataNode collection: Check if head position matches DataNode position

## 5. Performance Considerations

### 5.1 Optimization Strategies

1. **Position Comparison**
   - Use direct position comparison rather than 3D array lookups
   - Implement efficient position hashing for quick lookups

2. **Segment Management**
   - Limit maximum snake length based on grid size
   - Reuse segment objects rather than creating new ones

3. **Collision Detection**
   - Use spatial partitioning if snake becomes very long
   - Optimize boundary checks with early returns

4. **Rendering**
   - Use instanced rendering for snake segments
   - Implement level-of-detail for distant segments
   - Use efficient buffer updates for position changes

## 6. Domain-Specific Terminology

- **Data Node**: Collectible items that increase the snake's length
- **Axis Mind**: The conceptual theme of the game, referring to consciousness across dimensions
- **Fading Tail**: The mechanic where tail segments become invisible after a certain length
- **Sacred Geometry**: Visual design theme incorporating geometric patterns with spiritual significance