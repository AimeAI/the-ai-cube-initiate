
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import VoiceSynthesis from './VoiceSynthesis';

const HexModule = ({
  title, 
  status, 
  clickable, 
  voiceText
}: { 
  title: string; 
  status: string;
  clickable: boolean;
  voiceText: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`hexagon relative aspect-square ${
        clickable 
        ? 'cursor-pointer bg-cube-blue/10 border-cube-blue/50' 
        : 'bg-black/50 border-cube-violet/30'
      } border overflow-hidden transition-all duration-300 group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glitching data effect on hover */}
      {isHovered && (
        <div className="absolute inset-0 z-0 overflow-hidden opacity-40">
          <div className="absolute inset-0 flex flex-wrap">
            {Array.from({ length: 50 }).map((_, i) => (
              <div 
                key={i} 
                className="text-[8px] text-cube-blue/80"
                style={{ 
                  position: 'absolute',
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `glitch ${0.5 + Math.random() * 2}s ease-in-out infinite alternate-reverse`
                }}
              >
                {Math.random() > 0.5 ? '1' : '0'}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-10">
        <div className={`text-xl font-heading mb-2 ${clickable ? 'text-cube-blue' : 'text-gray-400'}`}>
          {title}
        </div>
        
        <div className="text-sm text-center mb-2 text-gray-400">
          {status}
        </div>

        {/* Visible description text */}
        <p
          className="text-xs text-center text-gray-300 mb-3 leading-tight px-2 overflow-hidden"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            maxHeight: 'calc(1.2em * 3)', // Fallback for maxHeight
            lineHeight: '1.2em' // Ensure consistent line height
          }}
          dangerouslySetInnerHTML={{ __html: voiceText }}
        />
        
        {clickable ? (
          <div className={`transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            {/* VoiceSynthesis can remain for hover, or be removed if description is always visible */}
            {/* <VoiceSynthesis text={voiceText} /> */}
          </div>
        ) : (
          <div className="w-6 h-6 rounded-full border border-cube-violet/50 flex items-center justify-center mt-auto mb-1"> {/* Adjusted lock icon position */}
            <span className="text-cube-violet text-sm">🔒</span>
          </div>
        )}
      </div>
      
      {/* Glowing boundary effect */}
      <div className={`absolute inset-0 border-2 border-transparent transition-all duration-500 ${
        isHovered ? (clickable ? 'border-cube-blue shadow-[0_0_15px_rgba(14,165,233,0.5)]' : 'border-cube-violet/30') : ''
      }`}></div>
    </div>
  );
};

const CoreSection = () => {
  const { t } = useTranslation();
  return (
    <section id="echoes" className="py-24 bg-black relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-l from-cube-gold/10 to-transparent opacity-30 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-r from-cube-blue/5 to-transparent opacity-20 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-16 text-center">
          <div className="inline-block py-2 px-4 border border-cube-violet/30 text-cube-violet text-sm mb-8">
            {t('core.cubesCore')}
          </div>
          <h2 className="font-heading text-4xl md:text-6xl text-white mb-16">{t('core.glimpses')}</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <HexModule
            title={t('core.classifierConstruct')}
            status={t('core.classifierStatus')}
            clickable={true}
            voiceText={t('core.classifierVoice')}
          />
          
          <HexModule
            title={t('core.predictorEngine')}
            status={t('core.predictorStatus')}
            clickable={true}
            voiceText={t('core.predictorVoice')}
          />
          
          <HexModule
            title={t('core.visionSystem')}
            status={t('core.visionStatus')}
            clickable={true}
            voiceText={t('core.visionVoice')}
          />
          
          <HexModule
            title={t('core.ethicsFramework')}
            status={t('core.ethicsStatus')}
            clickable={true}
            voiceText={t('core.ethicsVoice')}
          />
          
          <HexModule
            title={t('core.reinforcementLab')}
            status={t('core.reinforcementStatus')}
            clickable={true}
            voiceText={t('core.reinforcementVoice')}
          />
          
          <HexModule
            title={t('core.generativeCore')}
            status={t('core.generativeStatus')}
            clickable={true}
            voiceText={t('core.generativeVoice')}
          />
          
          <HexModule
            title={t('core.decisionTrees')}
            status={t('core.decisionTreesStatus')}
            clickable={true}
            voiceText={t('core.decisionTreesVoice')}
          />
          
          <HexModule
            title={t('core.neuralNetwork')}
            status={t('core.neuralNetworkStatus')}
            clickable={true}
            voiceText={t('core.neuralNetworkVoice')}
          />
          
          <HexModule
            title={t('core.foundersChamber')}
            status={t('core.foundersStatus')}
            clickable={true}
            voiceText={t('core.foundersVoice')}
          />
        </div>
      </div>
    </section>
  );
};

export default CoreSection;
