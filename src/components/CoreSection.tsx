
import React, { useState } from 'react';
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
        
        <div className="text-sm text-center mb-4 text-gray-400">
          {status}
        </div>
        
        {clickable ? (
          <div className={`transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <VoiceSynthesis text={voiceText} />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full border border-cube-violet/50 flex items-center justify-center">
            <span className="text-cube-violet">🔒</span>
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
  return (
    <section id="echoes" className="py-24 bg-black relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-l from-cube-gold/10 to-transparent opacity-30 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-r from-cube-blue/5 to-transparent opacity-20 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-16 text-center">
          <div className="inline-block py-2 px-4 border border-cube-violet/30 text-cube-violet text-sm mb-8">
            THE CUBE'S CORE
          </div>
          <h2 className="font-heading text-4xl md:text-6xl text-white mb-16">Glimpses of the Simulations</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <HexModule 
            title="Classifier Construct" 
            status="Trial Access Available" 
            clickable={true}
            voiceText="This construct teaches your AI to sort what others can't see."
          />
          
          <HexModule 
            title="Predictor Engine" 
            status="Access: Phase 2 Clearance Required" 
            clickable={false}
            voiceText=""
          />
          
          <HexModule 
            title="Vision System" 
            status="Pattern Detected – But Not Understood" 
            clickable={false}
            voiceText=""
          />
          
          <HexModule 
            title="Ethics Framework" 
            status="Sim unlocked upon successful trial completion" 
            clickable={false}
            voiceText=""
          />
          
          <HexModule 
            title="Reinforcement Lab" 
            status="Access: Phase 3 Clearance Required" 
            clickable={false}
            voiceText=""
          />
          
          <HexModule 
            title="Generative Core" 
            status="Pattern Detected – But Not Understood" 
            clickable={false}
            voiceText=""
          />
          
          <HexModule 
            title="Decision Trees" 
            status="Sim unlocked upon successful trial completion" 
            clickable={false}
            voiceText=""
          />
          
          <HexModule 
            title="Neural Network" 
            status="Access: Phase 2 Clearance Required" 
            clickable={false}
            voiceText=""
          />
          
          <HexModule 
            title="Founders Chamber" 
            status="Phase 4 Restricted – Not Yet Ready" 
            clickable={false}
            voiceText=""
          />
        </div>
      </div>
    </section>
  );
};

export default CoreSection;
