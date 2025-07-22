import { performanceOptimizer } from './performanceOptimization';

interface PreloadResource {
  url: string;
  type: 'script' | 'style' | 'image' | 'video' | 'audio';
  priority?: 'high' | 'medium' | 'low';
  crossOrigin?: 'anonymous' | 'use-credentials';
}

class ResourcePreloader {
  private preloadedResources = new Set<string>();
  private preloadPromises = new Map<string, Promise<void>>();

  public async preloadResource(resource: PreloadResource): Promise<void> {
    if (this.preloadedResources.has(resource.url)) {
      return this.preloadPromises.get(resource.url);
    }

    const promise = this.createPreloadPromise(resource);
    this.preloadPromises.set(resource.url, promise);

    try {
      await promise;
      this.preloadedResources.add(resource.url);
    } catch (error) {
      console.warn(`Failed to preload resource: ${resource.url}`, error);
      this.preloadPromises.delete(resource.url);
    }

    return promise;
  }

  private createPreloadPromise(resource: PreloadResource): Promise<void> {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.url;
      link.as = resource.type;
      
      if (resource.crossOrigin) {
        link.crossOrigin = resource.crossOrigin;
      }

      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`Failed to preload ${resource.url}`));

      document.head.appendChild(link);
    });
  }

  public async preloadCriticalResources(): Promise<void> {
    const config = performanceOptimizer.getOptimizedConfig();
    
    const criticalResources: PreloadResource[] = [
      // Critical fonts
      {
        url: '/fonts/inter-var.woff2',
        type: 'style',
        priority: 'high',
        crossOrigin: 'anonymous'
      },
      
      // Critical CSS
      {
        url: '/assets/critical.css',
        type: 'style',
        priority: 'high'
      }
    ];

    // Only preload Three.js if device supports it
    if (config.enableThreeJS) {
      criticalResources.push({
        url: '/assets/js/three.js',
        type: 'script',
        priority: 'medium'
      });
    }

    // Preload game assets for high-performance devices
    if (config.enableParticles) {
      criticalResources.push(
        {
          url: '/assets/aicube2.mp4',
          type: 'video',
          priority: 'low'
        },
        {
          url: '/assets/aicube3.mp4',
          type: 'video',
          priority: 'low'
        }
      );
    }

    await Promise.allSettled(
      criticalResources.map(resource => this.preloadResource(resource))
    );
  }

  public async preloadGameAssets(gameId: string): Promise<void> {
    const gameAssets: Record<string, PreloadResource[]> = {
      'snake-3': [
        {
          url: '/assets/js/EnhancedSnake3Game.js',
          type: 'script',
          priority: 'high'
        },
        {
          url: '/assets/three.js',
          type: 'script',
          priority: 'medium'
        }
      ],
      'neural-network-chamber': [
        {
          url: '/assets/js/EnhancedNeuralNetworkChamber.js',
          type: 'script',
          priority: 'high'
        },
        {
          url: '/assets/three-fiber.js',
          type: 'script',
          priority: 'medium'
        }
      ],
      'crystal-resonance': [
        {
          url: '/assets/js/EnhancedCrystalResonance.js',
          type: 'script',
          priority: 'high'
        },
        {
          url: '/assets/audio.js',
          type: 'script',
          priority: 'medium'
        }
      ]
    };

    const assets = gameAssets[gameId];
    if (!assets) return;

    await Promise.allSettled(
      assets.map(asset => this.preloadResource(asset))
    );
  }

  public prefetchPageResources(pathname: string): void {
    const routeAssets: Record<string, PreloadResource[]> = {
      '/games': [
        {
          url: '/assets/js/GamesHub.js',
          type: 'script',
          priority: 'medium'
        }
      ],
      '/pricing': [
        {
          url: '/assets/js/PricingPage.js',
          type: 'script',
          priority: 'medium'
        },
        {
          url: '/assets/js/stripe.js',
          type: 'script',
          priority: 'low'
        }
      ],
      '/dashboard/student': [
        {
          url: '/assets/js/StudentDashboard.js',
          type: 'script',
          priority: 'medium'
        }
      ],
      '/dashboard/parent': [
        {
          url: '/assets/js/ParentPortal.js',
          type: 'script',
          priority: 'medium'
        }
      ]
    };

    const assets = routeAssets[pathname];
    if (!assets) return;

    // Use requestIdleCallback for prefetching
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        assets.forEach(asset => this.preloadResource(asset));
      });
    } else {
      setTimeout(() => {
        assets.forEach(asset => this.preloadResource(asset));
      }, 100);
    }
  }

  public clearCache(): void {
    this.preloadedResources.clear();
    this.preloadPromises.clear();
  }
}

export const resourcePreloader = new ResourcePreloader();

// Initialize critical resource preloading
export const initializeResourcePreloading = async (): Promise<void> => {
  try {
    await resourcePreloader.preloadCriticalResources();
  } catch (error) {
    console.warn('Critical resource preloading failed:', error);
  }
};

// Preload resources on route change
export const preloadRouteResources = (pathname: string): void => {
  resourcePreloader.prefetchPageResources(pathname);
};