import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';

const PhilosophySection: React.FC = () => {
  const { t } = useTranslation();

  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <section id="philosophy" className="py-12 md:py-20 bg-background text-foreground">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('philosophy.title', 'The Heart of AI Cube: Our Philosophy')}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            {t('philosophy.subtitle', 'Discover the core principles that drive our educational games and experiences.')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div>
            <video
              ref={videoRef}
              src="/assets/aicubevideo.mp4"
              title={t('philosophy.videoAlt', 'AI Cube Philosophy Video')}
              className="rounded-lg shadow-xl mx-auto"
              width={500}
              height={350}
              muted // Recommended for autoplay
              playsInline // Important for iOS
              loop // Added for native looping
              autoPlay // Added for automatic playback
            />
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold mb-2">
                {t('philosophy.new_point1.title', 'Not your average subscription.')}
              </h3>
              <p className="text-muted-foreground">
                {t('philosophy.new_point1.description', 'This isn’t Netflix for math. It’s a simulator of minds — each payment unlocks more power.')}
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-2">
                {t('philosophy.new_point2.title', 'Not a linear course.')}
              </h3>
              <p className="text-muted-foreground">
                {t('philosophy.new_point2.description', 'There are no chapters. There are only riddles to decode, systems to master, and myths to forge.')}
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-2">
                {t('philosophy.new_point3.title', 'Not just a game.')}
              </h3>
              <p className="text-muted-foreground">
                {t('philosophy.new_point3.description', 'It’s gameplay with gravity — AI fluency disguised as play.')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhilosophySection;