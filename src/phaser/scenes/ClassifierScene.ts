import Phaser from 'phaser';

// Simple data structure for alien types
interface AlienData {
  id: number;
  spriteKey: string;
  correctClass: 'Class A' | 'Class B';
  textureName: string; // For dynamically created textures
}

export class ClassifierScene extends Phaser.Scene {
  private alienData: AlienData[] = [
    { id: 1, spriteKey: 'alien1', correctClass: 'Class A', textureName: 'alienTexture1' },
    { id: 2, spriteKey: 'alien2', correctClass: 'Class B', textureName: 'alienTexture2' },
    { id: 3, spriteKey: 'alien3', correctClass: 'Class A', textureName: 'alienTexture3' },
  ];
  private currentAlien: Phaser.GameObjects.Sprite | null = null;
  private currentAlienData: AlienData | null = null;

  // Stats for localStorage
  private attempts: number = 0;
  private correctClassifications: number = 0;
  private readonly localStorageKey = 'classifierConstructProgress';

  private dropZoneA: Phaser.GameObjects.Rectangle | null = null;
  private dropZoneB: Phaser.GameObjects.Rectangle | null = null;
  private decisionBoundaryLine: Phaser.GameObjects.Graphics | null = null;

  constructor() {
    super({ key: 'ClassifierScene' });
  }

  init() {
    // Load progress at the very beginning of the scene lifecycle
    this.loadProgress();
  }

  preload() {
    // Create placeholder textures for aliens since we can't load image files directly
    // Alien 1: Green Circle
    let graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(0x00ff00); // Green
    graphics.fillCircle(32, 32, 32); // Circle of radius 32
    graphics.generateTexture('alienTexture1', 64, 64);
    graphics.destroy();

    // Alien 2: Blue Square
    graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(0x0000ff); // Blue
    graphics.fillRect(0, 0, 64, 64); // Square of 64x64
    graphics.generateTexture('alienTexture2', 64, 64);
    graphics.destroy();

    // Alien 3: Yellow Triangle
    graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(0xffff00); // Yellow
    graphics.beginPath();
    graphics.moveTo(32, 0);
    graphics.lineTo(64, 64);
    graphics.lineTo(0, 64);
    graphics.closePath();
    graphics.fillPath();
    graphics.generateTexture('alienTexture3', 64, 64);
    graphics.destroy();
  }

  create() {
    this.cameras.main.setBackgroundColor(0x333333); // Dark grey background

    // Define Drop Zones
    this.dropZoneA = this.add.rectangle(200, 450, 200, 100, 0x555555).setStrokeStyle(2, 0xffffff);
    this.add.text(this.dropZoneA.x, this.dropZoneA.y, 'Class A', { font: '20px Arial', fill: '#ffffff' }).setOrigin(0.5);

    this.dropZoneB = this.add.rectangle(600, 450, 200, 100, 0x555555).setStrokeStyle(2, 0xffffff);
    this.add.text(this.dropZoneB.x, this.dropZoneB.y, 'Class B', { font: '20px Arial', fill: '#ffffff' }).setOrigin(0.5);

    // Log initial stats after loading
    console.log(`Initial Stats: Attempts - ${this.attempts}, Correct - ${this.correctClassifications}`);

    // Decision Boundary Visual Placeholder
    this.decisionBoundaryLine = this.add.graphics();
    this.drawDecisionBoundary(0.5); // Initial alpha
    this.tweens.add({
      targets: { alpha: 1 }, // Target an object with an alpha property
      alpha: 0.2, // Go to alpha 0.2
      duration: 1000,
      yoyo: true,
      repeat: -1,
      onUpdate: (tween) => {
        // 'this' in onUpdate refers to the tween itself, not the scene.
        // We need to access decisionBoundaryLine through the scene instance.
        // A common way is to ensure 'this' inside create() is the scene,
        // or pass the scene context if this callback were outside.
        // Here, since decisionBoundaryLine is a class member, it's accessible.
        if (this.decisionBoundaryLine) {
            this.drawDecisionBoundary(tween.getValue());
        }
      }
    });

    // Alien spawning area (implicit, aliens will spawn at a specific point)
    this.spawnAlien();

    // Drag event handlers
    this.input.on('dragstart', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Sprite) => {
      gameObject.setTint(0xffcc00); // Tint on drag start
    });

    this.input.on('drag', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Sprite, dragX: number, dragY: number) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on('dragend', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Sprite) => {
      gameObject.clearTint();
      this.handleDrop(gameObject);
    });
  }

  spawnAlien() {
    if (this.currentAlien) {
      this.currentAlien.destroy();
    }

    const randomIndex = Phaser.Math.Between(0, this.alienData.length - 1);
    this.currentAlienData = this.alienData[randomIndex];
    
    // Use the dynamically generated texture name
    this.currentAlien = this.add.sprite(400, 150, this.currentAlienData.textureName);
    this.currentAlien.setInteractive();
    this.input.setDraggable(this.currentAlien);

    console.log(`Spawned Alien: ${this.currentAlienData.spriteKey}, Correct Class: ${this.currentAlienData.correctClass}`);
  }

  handleDrop(alienSprite: Phaser.GameObjects.Sprite) {
    const dropZoneARect = this.dropZoneA?.getBounds();
    const dropZoneBRect = this.dropZoneB?.getBounds();
    let droppedInZone = false;
    let classifiedCorrectly = false;

    if (!this.currentAlienData) {
        console.error("No current alien data found for classification.");
        this.spawnAlien(); // Spawn a new one and exit
        return;
    }

    if (dropZoneARect && Phaser.Geom.Intersects.RectangleToRectangle(alienSprite.getBounds(), dropZoneARect)) {
      console.log(`Dropped in Class A. Alien is ${this.currentAlienData.spriteKey}, Correct: ${this.currentAlienData.correctClass}`);
      this.dropZoneA?.setFillStyle(0x00ff00, 0.5);
      this.time.delayedCall(200, () => this.dropZoneA?.setFillStyle(0x555555));
      droppedInZone = true;
      this.attempts++;
      if (this.currentAlienData.correctClass === 'Class A') {
        this.correctClassifications++;
        classifiedCorrectly = true;
        console.log('Correct Classification!');
      } else {
        console.log('Incorrect Classification.');
      }
    } else if (dropZoneBRect && Phaser.Geom.Intersects.RectangleToRectangle(alienSprite.getBounds(), dropZoneBRect)) {
      console.log(`Dropped in Class B. Alien is ${this.currentAlienData.spriteKey}, Correct: ${this.currentAlienData.correctClass}`);
      this.dropZoneB?.setFillStyle(0x00ff00, 0.5);
      this.time.delayedCall(200, () => this.dropZoneB?.setFillStyle(0x555555));
      droppedInZone = true;
      this.attempts++;
      if (this.currentAlienData.correctClass === 'Class B') {
        this.correctClassifications++;
        classifiedCorrectly = true;
        console.log('Correct Classification!');
      } else {
        console.log('Incorrect Classification.');
      }
    }

    if (droppedInZone) {
      this.saveProgress();
      this.spawnAlien();
    } else {
      // Optional: Snap back to original position if not dropped in a zone
      alienSprite.x = 400;
      alienSprite.y = 150;
    }
  }

  update() {
    // Scene update logic if needed
  }

  drawDecisionBoundary(alpha: number) {
    if (!this.decisionBoundaryLine) return;
    this.decisionBoundaryLine.clear();
    this.decisionBoundaryLine.lineStyle(4, 0x00ffff, alpha); // Cyan color, variable alpha
    this.decisionBoundaryLine.beginPath();
    this.decisionBoundaryLine.moveTo(50, 300); // Example line from left-middle
    this.decisionBoundaryLine.lineTo(750, 300); // To right-middle
    this.decisionBoundaryLine.strokePath();
  }

  saveProgress() {
    const accuracy = this.attempts > 0 ? this.correctClassifications / this.attempts : 0;
    const progress = {
      attempts: this.attempts,
      correctClassifications: this.correctClassifications,
      accuracy: accuracy,
    };
    localStorage.setItem(this.localStorageKey, JSON.stringify(progress));
    console.log('Progress Saved:', progress);
  }

  loadProgress() {
    const savedProgress = localStorage.getItem(this.localStorageKey);
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      this.attempts = progress.attempts || 0;
      this.correctClassifications = progress.correctClassifications || 0;
      console.log('Progress Loaded:', progress);
    } else {
      console.log('No saved progress found. Starting fresh.');
    }
  }
}
