// Three.js optimization utilities
import { 
  WebGLRenderer, 
  Scene, 
  PerspectiveCamera,
  BufferGeometry,
  Material,
  Mesh,
  Texture
} from 'three';

/**
 * Optimized WebGL renderer configuration
 */
export function createOptimizedRenderer(canvas?: HTMLCanvasElement): WebGLRenderer {
  const renderer = new WebGLRenderer({
    canvas,
    antialias: false, // Disable for better performance on mobile
    alpha: true,
    powerPreference: 'high-performance',
    stencil: false,
    depth: true
  });

  // Enable optimizations
  renderer.sortObjects = false;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap pixel ratio
  
  return renderer;
}

/**
 * Memory cleanup for Three.js objects
 */
export function disposeThreeJsResources(scene: Scene) {
  scene.traverse((object) => {
    if (object instanceof Mesh) {
      // Dispose geometry
      if (object.geometry) {
        object.geometry.dispose();
      }

      // Dispose materials
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => disposeMaterial(material));
        } else {
          disposeMaterial(object.material);
        }
      }
    }
  });

  // Clear the scene
  scene.clear();
}

function disposeMaterial(material: Material) {
  // Dispose textures
  for (const key in material) {
    const value = (material as any)[key];
    if (value && typeof value === 'object' && 'minFilter' in value) {
      // It's a texture
      (value as Texture).dispose();
    }
  }

  material.dispose();
}

/**
 * Performance monitoring for Three.js
 */
export class ThreeJsPerformanceMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 0;

  update() {
    this.frameCount++;
    const currentTime = performance.now();
    
    if (currentTime >= this.lastTime + 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
      this.frameCount = 0;
      this.lastTime = currentTime;
    }
  }

  getFPS(): number {
    return this.fps;
  }

  isPerformanceGood(): boolean {
    return this.fps > 30;
  }
}

/**
 * Adaptive quality settings based on performance
 */
export class AdaptiveQuality {
  private monitor = new ThreeJsPerformanceMonitor();
  private qualityLevel = 1; // 0 = low, 1 = medium, 2 = high
  private checkInterval = 60; // Check every 60 frames
  private frameCount = 0;

  update(renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera) {
    this.monitor.update();
    this.frameCount++;

    if (this.frameCount >= this.checkInterval) {
      this.adjustQuality(renderer);
      this.frameCount = 0;
    }
  }

  private adjustQuality(renderer: WebGLRenderer) {
    const fps = this.monitor.getFPS();
    
    if (fps < 25 && this.qualityLevel > 0) {
      // Reduce quality
      this.qualityLevel--;
      this.applyQualitySettings(renderer);
      console.log('Reduced Three.js quality to level:', this.qualityLevel);
    } else if (fps > 50 && this.qualityLevel < 2) {
      // Increase quality
      this.qualityLevel++;
      this.applyQualitySettings(renderer);
      console.log('Increased Three.js quality to level:', this.qualityLevel);
    }
  }

  private applyQualitySettings(renderer: WebGLRenderer) {
    switch (this.qualityLevel) {
      case 0: // Low quality
        renderer.setPixelRatio(0.5);
        renderer.shadowMap.enabled = false;
        break;
      case 1: // Medium quality
        renderer.setPixelRatio(1);
        renderer.shadowMap.enabled = false;
        break;
      case 2: // High quality
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        break;
    }
  }

  getQualityLevel(): number {
    return this.qualityLevel;
  }
}

/**
 * Lazy loading for heavy Three.js assets
 */
export class AssetLoader {
  private static loadedAssets = new Map<string, any>();

  static async loadModel(url: string): Promise<any> {
    if (this.loadedAssets.has(url)) {
      return this.loadedAssets.get(url);
    }

    try {
      // Dynamically import GLTFLoader only when needed
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
      const loader = new GLTFLoader();
      
      const model = await new Promise((resolve, reject) => {
        loader.load(url, resolve, undefined, reject);
      });

      this.loadedAssets.set(url, model);
      return model;
    } catch (error) {
      console.error('Failed to load model:', url, error);
      throw error;
    }
  }

  static async loadTexture(url: string): Promise<Texture> {
    if (this.loadedAssets.has(url)) {
      return this.loadedAssets.get(url);
    }

    try {
      const { TextureLoader } = await import('three');
      const loader = new TextureLoader();
      
      const texture = await new Promise<Texture>((resolve, reject) => {
        loader.load(url, resolve, undefined, reject);
      });

      this.loadedAssets.set(url, texture);
      return texture;
    } catch (error) {
      console.error('Failed to load texture:', url, error);
      throw error;
    }
  }

  static clearCache() {
    this.loadedAssets.clear();
  }
}