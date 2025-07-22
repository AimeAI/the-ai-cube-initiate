import React, { useRef, useEffect, useState } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface OptimizedVideoProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  playsInline?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
  poster?: string;
  'aria-label'?: string;
}

const OptimizedVideo: React.FC<OptimizedVideoProps> = ({
  src,
  className = '',
  style = {},
  autoPlay = false,
  loop = false,
  muted = true,
  controls = false,
  playsInline = true,
  preload = 'metadata',
  poster,
  'aria-label': ariaLabel
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [intersectionRef, isIntersecting] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px'
  });

  // Only load video when in viewport
  useEffect(() => {
    if (!isIntersecting || !videoRef.current) return;

    const video = videoRef.current;
    
    const handleLoadedData = () => {
      setIsLoaded(true);
      if (autoPlay) {
        video.play().catch(console.error);
      }
    };

    const handleError = () => {
      setHasError(true);
      console.error('Video failed to load:', src);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
    };
  }, [isIntersecting, autoPlay, src]);

  // Pause video when not visible for performance
  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    
    if (!isIntersecting && !video.paused) {
      video.pause();
    } else if (isIntersecting && video.paused && autoPlay && isLoaded) {
      video.play().catch(console.error);
    }
  }, [isIntersecting, autoPlay, isLoaded]);

  // Clean up on unmount
  useEffect(() => {
    const video = videoRef.current;
    return () => {
      if (video) {
        video.pause();
        video.src = '';
        video.load();
      }
    };
  }, []);

  if (hasError) {
    return (
      <div 
        className={`video-error ${className}`}
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          color: '#6B7280',
          fontSize: '14px',
          minHeight: '200px'
        }}
      >
        Video failed to load
      </div>
    );
  }

  return (
    <div 
      ref={intersectionRef}
      className={`optimized-video-container ${className}`}
      style={style}
    >
      {isIntersecting && (
        <video
          ref={videoRef}
          className={`optimized-video ${isLoaded ? 'loaded' : 'loading'}`}
          loop={loop}
          muted={muted}
          controls={controls}
          playsInline={playsInline}
          preload={preload}
          poster={poster}
          aria-label={ariaLabel}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
        >
          {/* Multiple source formats for better compatibility */}
          <source src={src.replace('.mp4', '.webm')} type="video/webm" />
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      
      {!isLoaded && isIntersecting && (
        <div 
          className="video-loading"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#00D4FF',
            fontSize: '14px'
          }}
        >
          Loading video...
        </div>
      )}
      
      <style jsx>{`
        .optimized-video-container {
          position: relative;
          overflow: hidden;
          will-change: transform;
          transform: translateZ(0);
        }
        
        .optimized-video {
          will-change: transform;
          transform: translateZ(0);
        }
        
        .optimized-video.loading {
          filter: blur(2px);
        }
        
        .optimized-video.loaded {
          filter: none;
        }
        
        /* Reduce quality on mobile for performance */
        @media (max-width: 768px) {
          .optimized-video {
            transform: scale(0.95);
            filter: contrast(0.9) brightness(0.9);
          }
        }
        
        /* Respect motion preferences */
        @media (prefers-reduced-motion: reduce) {
          .optimized-video {
            display: none;
          }
        }
        
        /* High contrast mode */
        @media (prefers-contrast: high) {
          .optimized-video {
            filter: contrast(1.5) brightness(1.2);
          }
        }
      `}</style>
    </div>
  );
};

export default OptimizedVideo;