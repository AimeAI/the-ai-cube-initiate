import React, { useState, useRef, useEffect } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: string;
  fallback?: React.ReactNode;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMUExQTFBIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjIwIiBmaWxsPSIjMzMzIi8+Cjwvc3ZnPg==',
  fallback = null,
  onLoad,
  onError
}) => {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [shouldLoad, setShouldLoad] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const [intersectionRef, isIntersecting] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px'
  });

  // Start loading when in viewport (unless priority)
  useEffect(() => {
    if (priority) {
      setShouldLoad(true);
    } else if (isIntersecting) {
      setShouldLoad(true);
    }
  }, [isIntersecting, priority]);

  // Preload image
  useEffect(() => {
    if (!shouldLoad) return;

    const img = new Image();
    img.onload = () => {
      setImageState('loaded');
      onLoad?.();
    };
    img.onerror = () => {
      setImageState('error');
      onError?.();
    };
    img.src = src;
  }, [shouldLoad, src, onLoad, onError]);

  if (imageState === 'error' && fallback) {
    return <>{fallback}</>;
  }

  return (
    <div 
      ref={intersectionRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {/* Placeholder while loading */}
      {imageState === 'loading' && (
        <img
          src={placeholder}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-sm"
          style={{
            filter: 'blur(4px) brightness(0.8)',
            transition: 'opacity 0.3s ease'
          }}
        />
      )}
      
      {/* Actual image */}
      {shouldLoad && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageState === 'loaded' ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ 
            width: width || '100%', 
            height: height || '100%' 
          }}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      )}
      
      {/* Loading indicator */}
      {imageState === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800/20">
          <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;