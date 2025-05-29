import React from 'react';
import { useTranslation } from 'react-i18next';

const PhilosophySection: React.FC = () => {
  const { t } = useTranslation();

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
            <img 
              src="/placeholder.svg" // Replace with an actual relevant image
              alt={t('philosophy.imageAlt', 'AI Cube Philosophy Illustration')} 
              className="rounded-lg shadow-xl mx-auto"
              width={500}
              height={350}
            />
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold mb-2">
                {t('philosophy.point1.title', 'Empowering Through Understanding')}
              </h3>
              <p className="text-muted-foreground">
                {t('philosophy.point1.description', 'We believe that true learning comes from understanding the "why" behind concepts. Our games are designed to demystify complex AI topics, making them accessible and engaging for young minds. We focus on building foundational knowledge that empowers students to become creators, not just consumers, of technology.')}
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-2">
                {t('philosophy.point2.title', 'Learning by Doing (and Playing!)')}
              </h3>
              <p className="text-muted-foreground">
                {t('philosophy.point2.description', 'The AI Cube champions interactive learning. Each game is a hands-on experience, allowing students to experiment, make mistakes, and learn in a supportive environment. We transform abstract theories into tangible challenges and playful discoveries, fostering critical thinking and problem-solving skills.')}
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-2">
                {t('philosophy.point3.title', 'Fostering Ethical AI Awareness')}
              </h3>
              <p className="text-muted-foreground">
                {t('philosophy.point3.description', "Beyond the technical, we aim to instill a sense of responsibility. Our curriculum subtly integrates discussions and scenarios about the ethical implications of AI, encouraging students to think about the societal impact of these powerful tools from an early age.")}
              </p>
            </div>
             <div>
              <h3 className="text-2xl font-semibold mb-2">
                {t('philosophy.point4.title', 'Achieving Future-Readiness')}
              </h3>
              <p className="text-muted-foreground">
                {t('philosophy.point4.description', "Our ultimate goal is to equip students with the skills and mindset needed to thrive in an AI-driven future. By making learning fun and intuitive, we help them develop a passion for technology and innovation, preparing them for future academic pursuits and careers.")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhilosophySection;