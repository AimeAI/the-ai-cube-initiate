import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, Gamepad2 } from 'lucide-react';
import { MythButton } from './myth/MythButton';
import OptimizedVideo from './OptimizedVideo';

interface VideoShowcaseItem {
  id: string;
  title: string;
  description: string;
  videoSrc: string;
  gameLink: string;
  concept: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  ctaText: string;
}

const videoShowcaseData: VideoShowcaseItem[] = [
  {
    id: 'neural-network',
    title: 'Neural Network Chamber',
    description: 'Build AI brains by connecting neurons - learn how artificial intelligence actually works!',
    videoSrc: 'assets/aicube2.mp4',
    gameLink: '/games/neural-network-chamber',
    concept: 'Neural Networks',
    difficulty: 'Intermediate',
    duration: '15-20 min',
    ctaText: 'Build Neural Networks'
  },
  {
    id: 'snake-ai',
    title: 'Snake³ AI Challenge',
    description: 'Program a 3D snake using AI logic - perfect introduction to programming concepts!',
    videoSrc: 'assets/aicube3.mp4',
    gameLink: '/games/snake-3',
    concept: 'Programming Logic',
    difficulty: 'Beginner',
    duration: '10-15 min',
    ctaText: 'Try Snake³ Game'
  },
  {
    id: 'quantum-chamber',
    title: 'Quantum Computing Lab',
    description: 'Explore the future of computing with interactive quantum mechanics simulations!',
    videoSrc: 'assets/aicubevideo.mp4',
    gameLink: '/games/quantum-chamber',
    concept: 'Quantum Computing',
    difficulty: 'Advanced',
    duration: '20-25 min',
    ctaText: 'Enter Quantum Lab'
  }
];

interface CyclingVideoShowcaseProps {
  autoPlay?: boolean;
  cycleInterval?: number;
  showControls?: boolean;
  className?: string;
}

const CyclingVideoShowcase: React.FC<CyclingVideoShowcaseProps> = ({
  autoPlay = true,
  cycleInterval = 8000,
  showControls = true,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentVideo = videoShowcaseData[currentIndex];

  // Auto-cycling logic
  useEffect(() => {
    if (isPlaying && !isHovered) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % videoShowcaseData.length);
      }, cycleInterval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, isHovered, cycleInterval]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % videoShowcaseData.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + videoShowcaseData.length) % videoShowcaseData.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Intermediate': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Advanced': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div 
      className={`cycling-video-showcase ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-2xl bg-myth-surface/20 border border-myth-accent/20">
        {/* Video Container */}
        <div className="relative aspect-video">
          <OptimizedVideo
            key={currentVideo.id}
            src={currentVideo.videoSrc}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            aria-label={`${currentVideo.title} demo video`}
          />
          
          {/* Video Overlay with Controls */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
            {/* Navigation Controls */}
            {showControls && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 opacity-0 hover:opacity-100 group-hover:opacity-100"
                  aria-label="Previous video"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 opacity-0 hover:opacity-100 group-hover:opacity-100"
                  aria-label="Next video"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                
                <button
                  onClick={togglePlayPause}
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300"
                  aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
              </>
            )}
            
            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <div className="max-w-2xl">
                {/* Game Info */}
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(currentVideo.difficulty)}`}>
                    {currentVideo.difficulty}
                  </span>
                  <span className="text-myth-textSecondary text-sm">
                    {currentVideo.duration} • {currentVideo.concept}
                  </span>
                </div>
                
                {/* Title and Description */}
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  {currentVideo.title}
                </h3>
                <p className="text-gray-200 text-lg mb-6 leading-relaxed">
                  {currentVideo.description}
                </p>
                
                {/* CTA Button */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href={currentVideo.gameLink} className="inline-block">
                    <MythButton 
                      className="bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack px-6 py-3 flex items-center gap-2 font-bold transform hover:scale-105 transition-all duration-300"
                      label={
                        <>
                          <Play className="w-5 h-5" />
                          {currentVideo.ctaText}
                        </>
                      }
                    />
                  </a>
                  <a href="#pricing" className="inline-block">
                    <MythButton 
                      className="border-2 border-white text-white hover:bg-white/10 px-6 py-3 transition-all duration-300"
                      label="See All Games"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {videoShowcaseData.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-electricCyan scale-125' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        {/* Progress Bar */}
        {isPlaying && !isHovered && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
            <div 
              className="h-full bg-gradient-to-r from-electricCyan to-neonMint transition-all duration-100 ease-linear"
              style={{
                width: `${((Date.now() % cycleInterval) / cycleInterval) * 100}%`
              }}
            />
          </div>
        )}
      </div>
      
      {/* Game Preview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {videoShowcaseData.map((video, index) => (
          <button
            key={video.id}
            onClick={() => goToSlide(index)}
            className={`text-left p-4 rounded-lg border transition-all duration-300 ${
              index === currentIndex
                ? 'border-electricCyan bg-electricCyan/10'
                : 'border-myth-surface hover:border-myth-accent/50 bg-myth-surface/30'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <Gamepad2 className={`w-5 h-5 ${index === currentIndex ? 'text-electricCyan' : 'text-myth-accent'}`} />
              <h4 className={`font-semibold ${index === currentIndex ? 'text-electricCyan' : 'text-myth-textPrimary'}`}>
                {video.title}
              </h4>
            </div>
            <p className="text-sm text-myth-textSecondary line-clamp-2">
              {video.description}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(video.difficulty)}`}>
                {video.difficulty}
              </span>
              <span className="text-xs text-myth-textSecondary">{video.duration}</span>
            </div>
          </button>
        ))}
      </div>
      
      <style jsx>{`
        .cycling-video-showcase {
          position: relative;
        }
        
        .cycling-video-showcase:hover .group-hover\\:opacity-100 {
          opacity: 1;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        @media (max-width: 768px) {
          .cycling-video-showcase .absolute.left-4,
          .cycling-video-showcase .absolute.right-4 {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default CyclingVideoShowcase;
