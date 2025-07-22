// WebGL Performance Optimization Utilities for AI Cube
// Implements cutting-edge 3D rendering optimizations for 60 FPS on all devices

import * as THREE from 'three';

export interface PerformanceConfig {
  targetFPS: number;
  maxDrawCalls: number;
  maxTriangles: number;
  pixelRatio: number;
  enableShadows: boolean;
  antiAliasing: boolean;
  lodEnabled: boolean;
  frustumCulling: boolean;
  occlusionCulling: boolean;
}

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  drawCalls: number;
  triangles: number;
  geometries: number;
  textures: number;
  memoryUsage: number;
}

export class WebGLOptimizer {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private config: PerformanceConfig;
  private metrics: PerformanceMetrics;
  private frameCount: number = 0;
  private lastTime: number = 0;
  private performanceTarget: number = 60;
  
  // LOD Management
  private lodObjects: Map<THREE.Object3D, THREE.LOD> = new Map();
  private instancedMeshes: Map<string, THREE.InstancedMesh> = new Map();
  
  // Culling
  private frustum: THREE.Frustum = new THREE.Frustum();
  private cameraMatrix: THREE.Matrix4 = new THREE.Matrix4();
  
  // Performance monitoring
  private fpsHistory: number[] = [];
  private adaptiveQuality: boolean = true;

  constructor(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.Camera,
    config: Partial<PerformanceConfig> = {}
  ) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    
    this.config = {
      targetFPS: 60,
      maxDrawCalls: 100,
      maxTriangles: 100000,
      pixelRatio: Math.min(window.devicePixelRatio, 2),
      enableShadows: true,
      antiAliasing: true,
      lodEnabled: true,
      frustumCulling: true,
      occlusionCulling: false,
      ...config
    };

    this.metrics = {
      fps: 0,
      frameTime: 0,
      drawCalls: 0,
      triangles: 0,
      geometries: 0,
      textures: 0,
      memoryUsage: 0
    };

    this.initializeOptimizations();
  }

  private initializeOptimizations(): void {
    // Set optimal renderer settings
    this.renderer.setPixelRatio(this.config.pixelRatio);
    this.renderer.shadowMap.enabled = this.config.enableShadows;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Enable performance features
    this.renderer.capabilities.logarithmicDepthBuffer = true;
    this.renderer.sortObjects = true;
    
    // Optimize WebGL state
    const gl = this.renderer.getContext();
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    
    // Set up automatic quality adjustment
    if (this.adaptiveQuality) {
      this.setupAdaptiveQuality();
    }
  }

  // Main optimization method called each frame
  public optimize(): void {
    this.updateMetrics();
    this.performFrustumCulling();
    this.updateLOD();
    this.manageInstancing();
    this.adaptQuality();
  }

  // Create LOD system for objects
  public createLOD(
    object: THREE.Object3D,
    distances: number[] = [0, 50, 100, 200]
  ): THREE.LOD {
    const lod = new THREE.LOD();
    
    // Create different detail levels
    distances.forEach((distance, index) => {
      const level = this.createLODLevel(object, index / distances.length);
      lod.addLevel(level, distance);
    });
    
    this.lodObjects.set(object, lod);
    return lod;
  }

  private createLODLevel(object: THREE.Object3D, quality: number): THREE.Object3D {
    const clone = object.clone();
    
    // Reduce geometry detail based on quality
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh && child.geometry) {
        const geometry = this.simplifyGeometry(child.geometry, quality);
        child.geometry = geometry;
        
        // Reduce texture quality for distant objects
        if (child.material instanceof THREE.Material) {
          this.adjustMaterialQuality(child.material, quality);
        }
      }
    });
    
    return clone;
  }

  private simplifyGeometry(geometry: THREE.BufferGeometry, quality: number): THREE.BufferGeometry {
    if (quality >= 0.8) return geometry;
    
    // Implement geometry simplification
    const simplified = geometry.clone();
    
    // For indexed geometries, remove vertices based on quality
    if (simplified.index) {
      const targetCount = Math.floor(simplified.index.count * quality);
      const newIndices = new Uint16Array(targetCount);
      
      // Simple decimation - keep every nth triangle
      const step = Math.ceil(simplified.index.count / targetCount);
      for (let i = 0, j = 0; i < simplified.index.count && j < targetCount; i += step, j++) {
        newIndices[j] = simplified.index.array[i];
      }
      
      simplified.setIndex(new THREE.BufferAttribute(newIndices, 1));
    }
    
    return simplified;
  }

  private adjustMaterialQuality(material: THREE.Material, quality: number): void {
    if (material instanceof THREE.MeshStandardMaterial) {
      // Reduce texture resolution for distant objects
      if (quality < 0.5 && material.map) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        const img = material.map.image;
        
        const scale = Math.max(0.25, quality);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const lowResTexture = new THREE.CanvasTexture(canvas);
        material.map = lowResTexture;
      }
      
      // Disable expensive features for low quality
      if (quality < 0.3) {
        material.normalMap = null;
        material.roughnessMap = null;
        material.metalnessMap = null;
      }
    }
  }

  // Instanced rendering for repeated objects
  public createInstancedMesh(
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    count: number,
    id: string
  ): THREE.InstancedMesh {
    const instancedMesh = new THREE.InstancedMesh(geometry, material, count);
    
    // Enable frustum culling per instance
    instancedMesh.frustumCulled = true;
    
    this.instancedMeshes.set(id, instancedMesh);
    return instancedMesh;
  }

  // Batch similar objects into instanced meshes
  private manageInstancing(): void {
    const objectGroups: Map<string, THREE.Mesh[]> = new Map();
    
    // Group similar objects
    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        const key = this.getMeshKey(object);
        if (!objectGroups.has(key)) {
          objectGroups.set(key, []);
        }
        objectGroups.get(key)!.push(object);
      }
    });
    
    // Convert groups to instanced meshes if beneficial
    objectGroups.forEach((meshes, key) => {
      if (meshes.length > 10 && !this.instancedMeshes.has(key)) {
        this.convertToInstancedMesh(meshes, key);
      }
    });
  }

  private getMeshKey(mesh: THREE.Mesh): string {
    const geometryId = mesh.geometry.id;
    const materialId = mesh.material instanceof Array 
      ? mesh.material.map(m => m.id).join('-')
      : mesh.material.id;
    return `${geometryId}-${materialId}`;
  }

  private convertToInstancedMesh(meshes: THREE.Mesh[], key: string): void {
    if (meshes.length === 0) return;
    
    const firstMesh = meshes[0];
    const instancedMesh = this.createInstancedMesh(
      firstMesh.geometry,
      firstMesh.material,
      meshes.length,
      key
    );
    
    // Set instance transforms
    meshes.forEach((mesh, index) => {
      mesh.updateMatrix();
      instancedMesh.setMatrixAt(index, mesh.matrix);
      
      // Remove original mesh from scene
      if (mesh.parent) {
        mesh.parent.remove(mesh);
      }
    });
    
    instancedMesh.instanceMatrix.needsUpdate = true;
    this.scene.add(instancedMesh);
  }

  // Frustum culling optimization
  private performFrustumCulling(): void {
    if (!this.config.frustumCulling) return;
    
    this.cameraMatrix.multiplyMatrices(
      this.camera.projectionMatrix,
      this.camera.matrixWorldInverse
    );
    this.frustum.setFromProjectionMatrix(this.cameraMatrix);
    
    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        // Check if object is in frustum
        object.visible = this.frustum.intersectsObject(object);
      }
    });
  }

  // Update LOD based on camera distance
  private updateLOD(): void {
    if (!this.config.lodEnabled) return;
    
    this.lodObjects.forEach((lod, original) => {
      lod.update(this.camera);
    });
  }

  // Adaptive quality system
  private setupAdaptiveQuality(): void {
    // Monitor performance and adjust quality automatically
    setInterval(() => {
      this.adjustQualityBasedOnPerformance();
    }, 1000);
  }

  private adjustQualityBasedOnPerformance(): void {
    const avgFPS = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;
    
    if (avgFPS < this.config.targetFPS * 0.8) {
      // Performance is low, reduce quality
      this.reduceQuality();
    } else if (avgFPS > this.config.targetFPS * 0.95) {
      // Performance is good, can increase quality
      this.increaseQuality();
    }
  }

  private reduceQuality(): void {
    // Reduce pixel ratio
    if (this.config.pixelRatio > 1) {
      this.config.pixelRatio = Math.max(1, this.config.pixelRatio - 0.25);
      this.renderer.setPixelRatio(this.config.pixelRatio);
    }
    
    // Disable shadows
    if (this.config.enableShadows) {
      this.config.enableShadows = false;
      this.renderer.shadowMap.enabled = false;
    }
    
    // Reduce LOD distances
    this.lodObjects.forEach(lod => {
      lod.levels.forEach(level => {
        level.distance *= 0.8;
      });
    });
  }

  private increaseQuality(): void {
    // Increase pixel ratio
    if (this.config.pixelRatio < Math.min(window.devicePixelRatio, 2)) {
      this.config.pixelRatio = Math.min(
        Math.min(window.devicePixelRatio, 2),
        this.config.pixelRatio + 0.25
      );
      this.renderer.setPixelRatio(this.config.pixelRatio);
    }
    
    // Enable shadows
    if (!this.config.enableShadows) {
      this.config.enableShadows = true;
      this.renderer.shadowMap.enabled = true;
    }
  }

  private adaptQuality(): void {
    // Dynamic quality adjustment based on current performance
    if (this.metrics.fps < this.config.targetFPS * 0.9) {
      this.performEmergencyOptimizations();
    }
  }

  private performEmergencyOptimizations(): void {
    // Immediate optimizations for performance recovery
    
    // Reduce render resolution temporarily
    const currentSize = this.renderer.getSize(new THREE.Vector2());
    this.renderer.setSize(
      currentSize.x * 0.9,
      currentSize.y * 0.9,
      false
    );
    
    // Skip every other frame for non-critical objects
    this.scene.traverse((object) => {
      if (object.userData.nonCritical) {
        object.visible = this.frameCount % 2 === 0;
      }
    });
  }

  // Performance metrics update
  private updateMetrics(): void {
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    
    if (deltaTime > 0) {
      this.metrics.fps = 1000 / deltaTime;
      this.metrics.frameTime = deltaTime;
      
      // Update FPS history
      this.fpsHistory.push(this.metrics.fps);
      if (this.fpsHistory.length > 60) {
        this.fpsHistory.shift();
      }
    }
    
    this.lastTime = currentTime;
    this.frameCount++;
    
    // Update render metrics
    const renderInfo = this.renderer.info;
    this.metrics.drawCalls = renderInfo.render.calls;
    this.metrics.triangles = renderInfo.render.triangles;
    this.metrics.geometries = renderInfo.memory.geometries;
    this.metrics.textures = renderInfo.memory.textures;
    
    // Estimate memory usage
    this.metrics.memoryUsage = this.estimateMemoryUsage();
  }

  private estimateMemoryUsage(): number {
    let totalMemory = 0;
    
    // Estimate geometry memory
    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh && object.geometry) {
        totalMemory += this.estimateGeometryMemory(object.geometry);
      }
    });
    
    return totalMemory;
  }

  private estimateGeometryMemory(geometry: THREE.BufferGeometry): number {
    let memory = 0;
    
    Object.values(geometry.attributes).forEach((attribute) => {
      memory += attribute.array.byteLength;
    });
    
    if (geometry.index) {
      memory += geometry.index.array.byteLength;
    }
    
    return memory;
  }

  // Public API methods
  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public getConfig(): PerformanceConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<PerformanceConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.initializeOptimizations();
  }

  public dispose(): void {
    this.lodObjects.clear();
    this.instancedMeshes.clear();
    this.fpsHistory = [];
  }
}

// GPU Particle System for efficient visual effects
export class GPUParticleSystem {
  private geometry: THREE.BufferGeometry;
  private material: THREE.ShaderMaterial;
  private mesh: THREE.Points;
  private particleCount: number;
  private time: number = 0;

  constructor(particleCount: number = 10000) {
    this.particleCount = particleCount;
    this.initializeParticles();
  }

  private initializeParticles(): void {
    this.geometry = new THREE.BufferGeometry();
    
    // Particle attributes
    const positions = new Float32Array(this.particleCount * 3);
    const velocities = new Float32Array(this.particleCount * 3);
    const lifetimes = new Float32Array(this.particleCount);
    const sizes = new Float32Array(this.particleCount);
    
    // Initialize particle data
    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;
      
      // Random initial positions
      positions[i3] = (Math.random() - 0.5) * 100;
      positions[i3 + 1] = (Math.random() - 0.5) * 100;
      positions[i3 + 2] = (Math.random() - 0.5) * 100;
      
      // Random velocities
      velocities[i3] = (Math.random() - 0.5) * 10;
      velocities[i3 + 1] = (Math.random() - 0.5) * 10;
      velocities[i3 + 2] = (Math.random() - 0.5) * 10;
      
      lifetimes[i] = Math.random() * 5 + 1;
      sizes[i] = Math.random() * 2 + 1;
    }
    
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    this.geometry.setAttribute('lifetime', new THREE.BufferAttribute(lifetimes, 1));
    this.geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // GPU-based particle shader
    this.material = new THREE.ShaderMaterial({
      vertexShader: this.getVertexShader(),
      fragmentShader: this.getFragmentShader(),
      uniforms: {
        time: { value: 0 },
        pointTexture: { value: new THREE.TextureLoader().load('/textures/particle.png') }
      },
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
      vertexColors: true
    });
    
    this.mesh = new THREE.Points(this.geometry, this.material);
  }

  private getVertexShader(): string {
    return `
      attribute float lifetime;
      attribute float size;
      attribute vec3 velocity;
      uniform float time;
      varying float vAlpha;
      
      void main() {
        float life = mod(time, lifetime) / lifetime;
        vec3 pos = position + velocity * time;
        
        vAlpha = 1.0 - life;
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;
  }

  private getFragmentShader(): string {
    return `
      uniform sampler2D pointTexture;
      varying float vAlpha;
      
      void main() {
        gl_FragColor = texture2D(pointTexture, gl_PointCoord);
        gl_FragColor.a *= vAlpha;
      }
    `;
  }

  public update(deltaTime: number): void {
    this.time += deltaTime;
    this.material.uniforms.time.value = this.time;
  }

  public getMesh(): THREE.Points {
    return this.mesh;
  }

  public dispose(): void {
    this.geometry.dispose();
    this.material.dispose();
  }
}

// Texture optimization utilities
export class TextureOptimizer {
  private static textureCache: Map<string, THREE.Texture> = new Map();
  private static atlasCache: Map<string, THREE.Texture> = new Map();

  public static optimizeTexture(
    texture: THREE.Texture,
    maxSize: number = 1024
  ): THREE.Texture {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    const img = texture.image;
    const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
    
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;
    
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    const optimizedTexture = new THREE.CanvasTexture(canvas);
    optimizedTexture.generateMipmaps = true;
    optimizedTexture.minFilter = THREE.LinearMipmapLinearFilter;
    
    return optimizedTexture;
  }

  public static createTextureAtlas(
    textures: THREE.Texture[],
    atlasSize: number = 2048
  ): { atlas: THREE.Texture; uvMaps: Array<{ u: number; v: number; width: number; height: number }> } {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = atlasSize;
    canvas.height = atlasSize;
    
    const uvMaps: Array<{ u: number; v: number; width: number; height: number }> = [];
    let x = 0;
    let y = 0;
    let rowHeight = 0;
    
    textures.forEach((texture) => {
      const img = texture.image;
      
      if (x + img.width > atlasSize) {
        x = 0;
        y += rowHeight;
        rowHeight = 0;
      }
      
      ctx.drawImage(img, x, y, img.width, img.height);
      
      uvMaps.push({
        u: x / atlasSize,
        v: y / atlasSize,
        width: img.width / atlasSize,
        height: img.height / atlasSize
      });
      
      x += img.width;
      rowHeight = Math.max(rowHeight, img.height);
    });
    
    const atlas = new THREE.CanvasTexture(canvas);
    atlas.generateMipmaps = true;
    
    return { atlas, uvMaps };
  }
}

export default WebGLOptimizer;