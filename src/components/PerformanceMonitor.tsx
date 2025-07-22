import React, { useEffect, useState } from 'react';

interface PerformanceMetrics {
  fps: number;
  memory: number;
  loadTime: number;
  renderTime: number;
  bundleSize: number;
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memory: 0,
    loadTime: 0,
    renderTime: 0,
    bundleSize: 0
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show only in development
    if (process.env.NODE_ENV !== 'development') return;
    
    let animationId: number;
    let lastTime = performance.now();
    let frameCount = 0;
    const fpsArray: number[] = [];

    const measureFPS = () => {
      const now = performance.now();
      const delta = now - lastTime;
      
      if (delta >= 1000) {
        const fps = Math.round((frameCount * 1000) / delta);
        fpsArray.push(fps);
        
        // Keep only last 10 measurements
        if (fpsArray.length > 10) {
          fpsArray.shift();
        }
        
        const avgFPS = fpsArray.reduce((a, b) => a + b, 0) / fpsArray.length;
        
        setMetrics(prev => ({
          ...prev,
          fps: Math.round(avgFPS)
        }));
        
        frameCount = 0;
        lastTime = now;
      }
      
      frameCount++;
      animationId = requestAnimationFrame(measureFPS);
    };

    const measureMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as { memory: { usedJSHeapSize: number } }).memory;
        setMetrics(prev => ({
          ...prev,
          memory: Math.round(memory.usedJSHeapSize / 1024 / 1024)
        }));
      }
    };

    const measureLoadTime = () => {
      if (performance.timing) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        setMetrics(prev => ({
          ...prev,
          loadTime: Math.round(loadTime)
        }));
      }
    };

    const measureRenderTime = () => {
      if (performance.getEntriesByType) {
        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        if (firstPaint) {
          setMetrics(prev => ({
            ...prev,
            renderTime: Math.round(firstPaint.startTime)
          }));
        }
      }
    };

    // Initial measurements
    measureLoadTime();
    measureRenderTime();
    
    // Continuous measurements
    animationId = requestAnimationFrame(measureFPS);
    const memoryInterval = setInterval(measureMemory, 2000);

    // Keyboard shortcut to toggle visibility
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(memoryInterval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!isVisible || process.env.NODE_ENV !== 'development') {
    return null;
  }

  const getPerformanceColor = (value: number, type: 'fps' | 'memory' | 'time') => {
    switch (type) {
      case 'fps':
        if (value >= 50) return '#10B981'; // Green
        if (value >= 30) return '#F59E0B'; // Yellow
        return '#EF4444'; // Red
      case 'memory':
        if (value <= 50) return '#10B981'; // Green
        if (value <= 100) return '#F59E0B'; // Yellow
        return '#EF4444'; // Red
      case 'time':
        if (value <= 1000) return '#10B981'; // Green
        if (value <= 3000) return '#F59E0B'; // Yellow
        return '#EF4444'; // Red
      default:
        return '#6B7280';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '8px',
        fontFamily: 'monospace',
        fontSize: '12px',
        minWidth: '200px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#00D4FF' }}>
        Performance Monitor
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span>FPS:</span>
        <span style={{ color: getPerformanceColor(metrics.fps, 'fps') }}>
          {metrics.fps || '--'}
        </span>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span>Memory:</span>
        <span style={{ color: getPerformanceColor(metrics.memory, 'memory') }}>
          {metrics.memory || '--'}MB
        </span>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span>Load Time:</span>
        <span style={{ color: getPerformanceColor(metrics.loadTime, 'time') }}>
          {metrics.loadTime || '--'}ms
        </span>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span>First Paint:</span>
        <span style={{ color: getPerformanceColor(metrics.renderTime, 'time') }}>
          {metrics.renderTime || '--'}ms
        </span>
      </div>
      
      <div style={{ marginTop: '8px', fontSize: '10px', color: '#6B7280' }}>
        Press Ctrl+Shift+P to toggle
      </div>
    </div>
  );
};

export default PerformanceMonitor;