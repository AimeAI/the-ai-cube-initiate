
import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

const AccessSection = () => {
  const { t } = useTranslation();
  return (
    <section id="access" className="min-h-screen bg-black flex flex-col items-center justify-center py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-to-r from-cube-violet/10 to-transparent opacity-30 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-l from-cube-blue/10 to-transparent opacity-20 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-16 text-center">
          <div className="inline-block py-2 px-4 border border-cube-blue/30 text-cube-blue text-sm mb-8">
            {t('access.granted')}
          </div>
          <h2 className="font-heading text-4xl md:text-6xl text-white mb-16" dangerouslySetInnerHTML={{ __html: t('access.whatThisIsnt') }} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <NotBlock text={t('access.notSubscription')} />
          <NotBlock text={t('access.notCourse')} />
          <NotBlock text={t('access.notGame')} />
        </div>
        
        <div className="glass-panel p-8 md:p-12 max-w-4xl mx-auto text-center">
          <p className="text-xl md:text-2xl text-white mb-8">
            {t('access.thisIs')}
          </p>
          
          <blockquote className="text-2xl md:text-3xl font-heading text-cube-blue italic mb-8">
            {t('access.quote')}
          </blockquote>
          
          <div className="h-px w-32 bg-cube-blue/30 mx-auto mb-8"></div>
          
          {/* Development Link to Snake³ Game */}
          <a
            href="/snake3"
            className="inline-block py-3 px-6 bg-cube-blue/20 hover:bg-cube-blue/30 text-cube-blue border border-cube-blue/40 rounded-md transition-all duration-300"
          >
            {t('access.trySnake3')}
          </a>
        </div>
      </div>
    </section>
  );
};

const NotBlock = ({ text }: { text: string }) => {
  return (
    <div className="glass-panel p-8 border-cube-blue/20 h-40 flex items-center justify-center transition-all duration-300 hover:border-cube-blue/50 group">
      <p className="text-2xl text-white group-hover:text-cube-blue transition-colors duration-300">
        {text}
      </p>
    </div>
  );
};

export default AccessSection;
