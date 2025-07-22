// Performance optimization utilities for AI Cube
import React from 'react';

export interface PerformanceConfig {
  targetFPS: number;
  memoryThreshold: number;
  enableThreeJS: boolean;
  enableParticles: boolean;
  reduceMotion: boolean;
}

export class PerformanceOptimizer {
  private config: PerformanceConfig;
  private frameCount: number = 0;
  private lastTime: number = 0;
  private fpsHistory: number[] = [];
  
  constructor(config: Partial<PerformanceConfig> = {}) {
    this.config = {
      targetFPS: 60,
      memoryThreshold: 100, // MB
      enableThreeJS: true,
      enableParticles: true,
      reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      ...config
    };
    
    this.detectCapabilities();
  }

  private detectCapabilities(): void {
    // Detect device capabilities
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    // Check WebGL support
    if (!gl) {
      this.config.enableThreeJS = false;
      this.config.enableParticles = false;
    }
    
    // Check hardware concurrency
    const cores = navigator.hardwareConcurrency || 4;
    if (cores < 4) {
      this.config.enableParticles = false;
    }
    
    // Check memory
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      if (memory.jsHeapSizeLimit < 1000000000) { // Less than 1GB
        this.config.enableThreeJS = false;
      }
    }
    
    // Check if mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      this.config.targetFPS = 30;
      this.config.enableParticles = false;
    }
    
    // Check connection speed
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        this.config.enableThreeJS = false;
      }
    }
  }

  public getOptimizedConfig(): PerformanceConfig {
    return { ...this.config };
  }

  public shouldRenderThreeJS(): boolean {
    return this.config.enableThreeJS && !this.config.reduceMotion;
  }

  public shouldRenderParticles(): boolean {
    return this.config.enableParticles && !this.config.reduceMotion;
  }

  public getTargetFPS(): number {
    return this.config.targetFPS;
  }

  public trackFPS(callback?: (fps: number) => void): void {
    const now = performance.now();
    const delta = now - this.lastTime;
    
    if (delta >= 1000) {
      const fps = Math.round((this.frameCount * 1000) / delta);
      this.fpsHistory.push(fps);
      
      if (this.fpsHistory.length > 10) {
        this.fpsHistory.shift();
      }
      
      const avgFPS = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;
      
      // Auto-adjust based on performance
      if (avgFPS < this.config.targetFPS * 0.8) {
        this.reduceQuality();
      }
      
      if (callback) {
        callback(avgFPS);
      }
      
      this.frameCount = 0;
      this.lastTime = now;
    }
    
    this.frameCount++;
  }

  private reduceQuality(): void {
    console.log('Performance: Reducing quality due to low FPS');
    
    if (this.config.enableParticles) {
      this.config.enableParticles = false;
      this.dispatchEvent('performance-reduced', { particles: false });
    } else if (this.config.targetFPS > 30) {
      this.config.targetFPS = 30;
      this.dispatchEvent('performance-reduced', { targetFPS: 30 });
    }
  }

  private dispatchEvent(type: string, detail: any): void {
    window.dispatchEvent(new CustomEvent(type, { detail }));
  }

  public measureMemoryUsage(): number {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return Math.round(memory.usedJSHeapSize / 1024 / 1024);
    }
    return 0;
  }

  public isMemoryPressure(): boolean {
    const usage = this.measureMemoryUsage();
    return usage > this.config.memoryThreshold;
  }

  public createOptimizedAnimationFrame(callback: () => void): number {
    const targetInterval = 1000 / this.config.targetFPS;
    let lastTime = 0;
    
    const frame = (currentTime: number) => {
      if (currentTime - lastTime >= targetInterval) {
        callback();
        lastTime = currentTime;
      }
      return requestAnimationFrame(frame);
    };
    
    return requestAnimationFrame(frame);
  }

  public throttle<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout | null = null;
    let lastExecTime = 0;
    
    return (...args: Parameters<T>) => {
      const currentTime = Date.now();
      
      if (currentTime - lastExecTime > delay) {
        func(...args);
        lastExecTime = currentTime;
      } else {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
          func(...args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  }

  public debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout | null = null;
    
    return (...args: Parameters<T>) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }

  public createWebWorker(script: string): Worker | null {
    try {
      const blob = new Blob([script], { type: 'application/javascript' });
      const url = URL.createObjectURL(blob);
      return new Worker(url);
    } catch (error) {
      console.error('Failed to create web worker:', error);
      return null;
    }
  }

  public preloadResources(urls: string[]): Promise<void[]> {
    return Promise.all(
      urls.map(url => {
        return new Promise<void>((resolve, reject) => {
          if (url.endsWith('.js')) {
            const script = document.createElement('script');
            script.src = url;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
            document.head.appendChild(script);
          } else if (url.endsWith('.css')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;
            link.onload = () => resolve();
            link.onerror = () => reject(new Error(`Failed to load stylesheet: ${url}`));
            document.head.appendChild(link);
          } else {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
            img.src = url;
          }
        });
      })
    );
  }

  public async warmupGPU(): Promise<void> {
    if (!this.config.enableThreeJS) return;
    
    try {
      // Create a minimal WebGL context to warm up GPU
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (gl) {
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.finish();
      }
    } catch (error) {
      console.error('GPU warmup failed:', error);
    }
  }

  public logPerformanceMetrics(): void {
    const metrics = {
      config: this.config,
      memory: this.measureMemoryUsage(),
      fps: this.fpsHistory.length > 0 ? this.fpsHistory[this.fpsHistory.length - 1] : 0,
      userAgent: navigator.userAgent,
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemory: (navigator as any).deviceMemory,
      connection: (navigator as any).connection?.effectiveType
    };
    
    console.log('Performance Metrics:', metrics);
  }
}

// Global performance optimizer instance
export const performanceOptimizer = new PerformanceOptimizer();

// React hook for performance optimization
export const usePerformanceOptimization = () => {
  const [config, setConfig] = React.useState(performanceOptimizer.getOptimizedConfig());
  const [fps, setFPS] = React.useState(0);
  const [memory, setMemory] = React.useState(0);
  
  React.useEffect(() => {
    const handlePerformanceReduced = (event: CustomEvent) => {
      setConfig(performanceOptimizer.getOptimizedConfig());
    };
    
    window.addEventListener('performance-reduced', handlePerformanceReduced as EventListener);
    
    const interval = setInterval(() => {
      performanceOptimizer.trackFPS(setFPS);
      setMemory(performanceOptimizer.measureMemoryUsage());
    }, 1000);
    
    return () => {
      window.removeEventListener('performance-reduced', handlePerformanceReduced as EventListener);
      clearInterval(interval);
    };
  }, []);
  
  return {
    config,
    fps,
    memory,
    shouldRenderThreeJS: performanceOptimizer.shouldRenderThreeJS(),
    shouldRenderParticles: performanceOptimizer.shouldRenderParticles(),
    isMemoryPressure: performanceOptimizer.isMemoryPressure()
  };
};