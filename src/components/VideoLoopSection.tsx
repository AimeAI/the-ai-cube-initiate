import React from 'react';

interface VideoLoopSectionProps {
  videoSrc: string;
  altText: string;
}

const VideoLoopSection: React.FC<VideoLoopSectionProps> = ({ videoSrc, altText }) => {
  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <video
            className="max-w-full h-auto rounded-lg shadow-xl"
            style={{ maxWidth: '800px' }} // Prevents distortion, adjust as needed
            autoPlay
            loop
            muted
            playsInline
            aria-label={altText}
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  );
};

export default VideoLoopSection;