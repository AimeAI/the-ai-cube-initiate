# Snake³: The Axis Mind - Core Game Logic Pseudocode

This document outlines the pseudocode for the core game logic of Snake³: The Axis Mind, focusing on the game loop, state management, and core mechanics.

## 1. Game Initialization

```
function initializeGame():
    // Initialize game state
    gameState = new GameState()
    
    // Initialize grid dimensions
    gridSize = 8  // 8×8×8 cube
    
    // Initialize snake at center of grid
    initialPosition = new Position(Math.floor(gridSize/2), Math.floor(gridSize/2), Math.floor(gridSize/2))
    initialDirection = Direction.RIGHT
    snake = new Snake(initialPosition, initialDirection)
    gameState.snake = snake
    
    // Initialize first data node
    spawnDataNode()
    
    // Initialize voice guidance
    voiceGuidance = new VoiceGuidance()
    voiceGuidance.speak("Welcome to Snake Cubed: The Axis Mind. Use WASD to move in the X-Y plane, and Q-E to move along the Z axis.")
    
    // Initialize game parameters
    gameState.score = 0
    gameState.nodesCollected = 0
    gameState.elapsedTime = 0
    gameState.gameSpeed = CONFIG.INITIAL_GAME_SPEED
    gameState.isPaused = false
    gameState.isGameOver = false
    gameState.isVictory = false
    
    // Start game loop
    startGameLoop()

// TEST: [Game initializes with snake at center of grid]
// TEST: [Game initializes with correct initial direction]
// TEST: [Game initializes with first data node in valid position]
// TEST: [Game initializes with correct starting parameters]
```

## 2. Game Loop

```
function gameLoop(timestamp):
    // Calculate delta time since last frame
    if (!gameState.lastTimestamp) {
        gameState.lastTimestamp = timestamp
    }
    const deltaTime = timestamp - gameState.lastTimestamp
    gameState.lastTimestamp = timestamp
    
    // Skip update if game is paused or over
    if (gameState.isPaused || gameState.isGameOver || gameState.isVictory) {
        requestAnimationFrame(gameLoop)
        return
    }
    
    // Update game state
    updateGame(deltaTime)
    
    // Render game
    renderGame()
    
    // Continue loop
    requestAnimationFrame(gameLoop)

// TEST: [Game loop calculates correct delta time]
// TEST: [Game loop skips updates when game is paused]
// TEST: [Game loop skips updates when game is over]
// TEST: [Game loop continues running at target frame rate]
```

## 3. Game State Update

```
function updateGame(deltaTime):
    // Update elapsed time
    gameState.elapsedTime += deltaTime / 1000  // Convert to seconds
    
    // Check if it's time to move the snake
    gameState.moveAccumulator += deltaTime
    if (gameState.moveAccumulator >= 1000 / gameState.gameSpeed) {
        gameState.moveAccumulator = 0
        
        // Apply pending direction change
        if (gameState.snake.nextDirection) {
            gameState.snake.direction = gameState.snake.nextDirection
            gameState.snake.nextDirection = null
            
            // Announce direction change
            voiceGuidance.announceDirection(gameState.snake.direction)
        }
        
        // Move snake
        moveSnake()
        
        // Check for collisions
        checkCollisions()
        
        // Check win conditions
        checkWinConditions()
    }

// TEST: [Game state updates elapsed time correctly]
// TEST: [Snake moves at correct speed based on game speed]
// TEST: [Direction changes are applied correctly]
// TEST: [Voice guidance announces direction changes]
```

## 4. Snake Movement

```
function moveSnake():
    // Get current head position
    const head = gameState.snake.getHead()
    const currentPosition = head.position
    
    // Calculate new head position
    const newPosition = new Position(
        currentPosition.x + gameState.snake.direction.x,
        currentPosition.y + gameState.snake.direction.y,
        currentPosition.z + gameState.snake.direction.z
    )
    
    // Add new head segment
    gameState.snake.segments.unshift(new SnakeSegment(newPosition, true, 0))
    
    // Update indices of all segments
    for (let i = 1; i < gameState.snake.segments.length; i++) {
        gameState.snake.segments[i].index = i
        
        // Update visibility based on index
        gameState.snake.segments[i].isVisible = (i < gameState.snake.visibleSegmentCount)
    }
    
    // Remove tail segment if no growth is pending
    if (gameState.snake.growthPending > 0) {
        gameState.snake.growthPending--
    } else {
        gameState.snake.segments.pop()
    }

// TEST: [Snake head moves in the correct direction]
// TEST: [Snake segments follow the head's previous positions]
// TEST: [Snake grows when growth is pending]
// TEST: [Snake segments beyond visibleSegmentCount are invisible]
```

## 5. Input Handling

```
function handleInput(key):
    // Skip input handling if game is over or in victory state
    if (gameState.isGameOver || gameState.isVictory) {
        return
    }
    
    // Handle pause toggle
    if (key === "Escape" || key === "p") {
        togglePause()
        return
    }
    
    // Skip further input handling if game is paused
    if (gameState.isPaused) {
        return
    }
    
    // Handle direction changes
    const currentDirection = gameState.snake.direction
    let newDirection = null
    
    switch (key) {
        // X-Y plane movement (WASD)
        case "w":
        case "ArrowUp":
            newDirection = Direction.UP
            break
        case "a":
        case "ArrowLeft":
            newDirection = Direction.LEFT
            break
        case "s":
        case "ArrowDown":
            newDirection = Direction.DOWN
            break
        case "d":
        case "ArrowRight":
            newDirection = Direction.RIGHT
            break
            
        // Z-axis movement (Q/E)
        case "q":
            newDirection = Direction.BACKWARD
            break
        case "e":
            newDirection = Direction.FORWARD
            break
    }
    
    // Validate direction change (can't reverse direction)
    if (newDirection && !isOppositeDirection(currentDirection, newDirection)) {
        gameState.snake.nextDirection = newDirection
    }

// TEST: [Game pauses and resumes with correct key press]
// TEST: [Direction changes with WASD keys]
// TEST: [Direction changes with arrow keys]
// TEST: [Z-axis movement with Q/E keys]
// TEST: [Cannot reverse direction (180° turn)]
```

## 6. Collision Detection

```
function checkCollisions():
    // Get snake head
    const head = gameState.snake.getHead()
    
    // Check boundary collision
    if (!isWithinBounds(head.position)) {
        handleCollision("boundary")
        return
    }
    
    // Check self collision
    if (isSelfCollision()) {
        handleCollision("self")
        return
    }
    
    // Check data node collection
    if (isDataNodeCollision()) {
        collectDataNode()
    }

function isWithinBounds(position):
    return (
        position.x >= 0 && position.x < gridSize &&
        position.y >= 0 && position.y < gridSize &&
        position.z >= 0 && position.z < gridSize
    )

function isSelfCollision():
    const head = gameState.snake.getHead()
    
    // Check collision with any segment except the head
    for (let i = 1; i < gameState.snake.segments.length; i++) {
        const segment = gameState.snake.segments[i]
        if (positionsEqual(head.position, segment.position)) {
            return true
        }
    }
    
    return false

function isDataNodeCollision():
    const head = gameState.snake.getHead()
    return positionsEqual(head.position, gameState.dataNode.position)

function handleCollision(type):
    gameState.isGameOver = true
    
    // Announce collision
    if (type === "boundary") {
        voiceGuidance.speak("Game over. You hit the boundary.")
    } else if (type === "self") {
        voiceGuidance.speak("Game over. You collided with your own tail.")
    }

// TEST: [Detects collision with grid boundaries]
// TEST: [Detects collision with snake's own tail]
// TEST: [Detects collision with invisible tail segments]
// TEST: [Handles game over state on collision]
// TEST: [Voice guidance announces correct collision type]
```

## 7. Data Node Collection

```
function collectDataNode():
    // Increase score
    gameState.score += gameState.dataNode.value
    
    // Increase nodes collected count
    gameState.nodesCollected++
    
    // Grow snake
    gameState.snake.growthPending += 1
    
    // Announce collection
    voiceGuidance.speak(`Data node collected. ${10 - gameState.nodesCollected} remaining.`)
    
    // Spawn new data node
    spawnDataNode()

function spawnDataNode():
    // Find available positions (not occupied by snake)
    const availablePositions = []
    
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            for (let z = 0; z < gridSize; z++) {
                const position = new Position(x, y, z)
                if (!isPositionOccupied(position)) {
                    availablePositions.push(position)
                }
            }
        }
    }
    
    // Select random available position
    if (availablePositions.length > 0) {
        const randomIndex = Math.floor(Math.random() * availablePositions.length)
        const position = availablePositions[randomIndex]
        
        // Create new data node
        gameState.dataNode = new DataNode(position, 10)  // Default value of 10 points
    } else {
        // Handle edge case: no available positions
        // This should be extremely rare in an 8×8×8 grid
        console.warn("No available positions for data node")
    }

function isPositionOccupied(position):
    // Check if position is occupied by any snake segment
    for (const segment of gameState.snake.segments) {
        if (positionsEqual(position, segment.position)) {
            return true
        }
    }
    
    return false

// TEST: [Increases score when data node is collected]
// TEST: [Increases nodes collected count]
// TEST: [Snake grows by one segment when data node is collected]
// TEST: [New data node spawns in valid position (not occupied by snake)]
// TEST: [Voice guidance announces correct number of remaining nodes]
```

## 8. Win Condition Checking

```
function checkWinConditions():
    // Check collection win condition (10 nodes)
    if (gameState.nodesCollected >= 10) {
        handleVictory("collection")
        return
    }
    
    // Check survival win condition (60 seconds)
    if (gameState.elapsedTime >= 60) {
        handleVictory("survival")
        return
    }

function handleVictory(type):
    gameState.isVictory = true
    gameState.victoryType = type
    
    // Announce victory
    if (type === "collection") {
        voiceGuidance.speak("Victory! You have collected all 10 data nodes.")
    } else if (type === "survival") {
        voiceGuidance.speak("Victory! You have survived for 60 seconds.")
    }
    
    // Display victory screen
    showVictoryScreen()

// TEST: [Triggers victory when 10 data nodes are collected]
// TEST: [Triggers victory when player survives for 60 seconds]
// TEST: [Voice guidance announces correct victory type]
// TEST: [Game state updates correctly on victory]
```

## 9. Pause Functionality

```
function togglePause():
    gameState.isPaused = !gameState.isPaused
    
    if (gameState.isPaused) {
        voiceGuidance.speak("Game paused.")
    } else {
        voiceGuidance.speak("Game resumed.")
    }
    
    // Update UI
    updatePauseUI()

// TEST: [Game pauses and unpauses correctly]
// TEST: [Voice guidance announces pause state changes]
// TEST: [UI updates to reflect pause state]
```

## 10. Voice Guidance Integration

```
function initializeVoiceGuidance():
    // Check if speech synthesis is supported
    if (!window.speechSynthesis) {
        console.warn("Speech synthesis not supported")
        return
    }
    
    // Initialize voice guidance
    voiceGuidance = new VoiceGuidance()
    
    // Set default voice (can be configured in settings)
    const voices = window.speechSynthesis.getVoices()
    if (voices.length > 0) {
        // Prefer a female voice if available
        const femaleVoice = voices.find(voice => voice.name.includes("female") || voice.name.includes("Female"))
        if (femaleVoice) {
            voiceGuidance.setVoice(femaleVoice)
        } else {
            voiceGuidance.setVoice(voices[0])
        }
    }
    
    // Set default parameters
    voiceGuidance.setVolume(0.8)
    voiceGuidance.setRate(1.0)
    voiceGuidance.setPitch(1.0)

// VoiceGuidance class methods (implementation in separate file)
function announceDirection(direction):
    let message = "Moving "
    
    if (direction === Direction.UP) message += "up"
    else if (direction === Direction.DOWN) message += "down"
    else if (direction === Direction.LEFT) message += "left"
    else if (direction === Direction.RIGHT) message += "right"
    else if (direction === Direction.FORWARD) message += "forward"
    else if (direction === Direction.BACKWARD) message += "backward"
    
    speak(message, false)  // Non-priority message

function announceWarning(type):
    if (type === "boundary") {
        speak("Warning: Approaching boundary", true)
    } else if (type === "self") {
        speak("Warning: Approaching your tail", true)
    }

// TEST: [Voice guidance initializes with supported voices]
// TEST: [Voice guidance announces direction changes correctly]
// TEST: [Voice guidance announces warnings with priority]
// TEST: [Voice guidance handles unsupported browsers gracefully]
```

## 11. Helper Functions

```
function positionsEqual(pos1, pos2):
    return pos1.x === pos2.x && pos1.y === pos2.y && pos1.z === pos2.z

function isOppositeDirection(dir1, dir2):
    return (
        (dir1.x !== 0 && dir2.x === -dir1.x && dir1.y === dir2.y && dir1.z === dir2.z) ||
        (dir1.y !== 0 && dir2.y === -dir1.y && dir1.x === dir2.x && dir1.z === dir2.z) ||
        (dir1.z !== 0 && dir2.z === -dir1.z && dir1.x === dir2.x && dir1.y === dir2.y)
    )

function getRandomInt(min, max):
    return Math.floor(Math.random() * (max - min + 1)) + min

// TEST: [positionsEqual correctly compares two positions]
// TEST: [isOppositeDirection correctly identifies opposite directions]
// TEST: [getRandomInt returns values within the specified range]
```

## 12. Configuration Constants

```
const CONFIG = {
    GRID_SIZE: 8,
    INITIAL_GAME_SPEED: 5,  // Moves per second
    VISIBLE_SEGMENTS: 3,
    REQUIRED_NODES: 10,
    SURVIVAL_TIME: 60,  // Seconds
    GROWTH_PER_NODE: 1
}

// TEST: [Configuration constants are used consistently throughout the code]
// TEST: [Game behavior changes appropriately when constants are modified]
```

## 13. Error Handling

```
function handleError(error, context):
    console.error(`Error in ${context}:`, error)
    
    // Log error for debugging
    logError(error, context)
    
    // Attempt to recover if possible
    if (context === "gameLoop") {
        // Try to restart game loop
        requestAnimationFrame(gameLoop)
    } else if (context === "spawnDataNode") {
        // Try alternative spawning method
        spawnDataNodeFallback()
    } else if (context === "voiceGuidance") {
        // Disable voice guidance and continue
        voiceGuidance.enabled = false
    }

// TEST: [Errors are properly logged with context]
// TEST: [Game attempts to recover from non-critical errors]
// TEST: [Game degrades gracefully when features are unavailable]
```

## 14. Performance Optimization

```
function optimizeRendering():
    // Only render visible objects
    const visibleSegments = gameState.snake.segments.filter(segment => segment.isVisible)
    
    // Use instanced rendering for similar objects
    renderInstancedMeshes(visibleSegments)
    
    // Optimize for distance (level of detail)
    applyLevelOfDetail()

function throttleNonEssentialOperations(deltaTime):
    // Accumulate time for non-essential operations
    nonEssentialAccumulator += deltaTime
    
    // Only perform non-essential operations periodically
    if (nonEssentialAccumulator > NON_ESSENTIAL_INTERVAL) {
        nonEssentialAccumulator = 0
        
        // Perform non-essential operations
        updateParticleEffects()
        updateBackgroundAnimation()
    }

// TEST: [Rendering optimization maintains target frame rate]
// TEST: [Non-essential operations are properly throttled]
// TEST: [Performance remains stable with long snake length]
```

## 15. Accessibility Features

```
function configureAccessibility(options):
    // Configure voice guidance
    if (options.voiceGuidance !== undefined) {
        voiceGuidance.enabled = options.voiceGuidance
    }
    
    // Configure game speed
    if (options.gameSpeed !== undefined) {
        gameState.gameSpeed = options.gameSpeed
    }
    
    // Configure visual contrast
    if (options.highContrast !== undefined) {
        setHighContrastMode(options.highContrast)
    }
    
    // Configure control scheme
    if (options.controlScheme !== undefined) {
        setControlScheme(options.controlScheme)
    }

// TEST: [Voice guidance can be enabled/disabled]
// TEST: [Game speed can be adjusted for accessibility]
// TEST: [High contrast mode changes visual appearance]
// TEST: [Control scheme can be customized]