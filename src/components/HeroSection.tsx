
import { useEffect, useState } from 'react';
import CubeComponent from './Cube';
import VoiceSynthesis from './VoiceSynthesis';

const HeroSection = () => {
  const [showScrollHint, setShowScrollHint] = useState(false);
  
  useEffect(() => {
    // Show scroll hint after 5 seconds
    const timer = setTimeout(() => {
      setShowScrollHint(true);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <section className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-black via-black to-[#050515]">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cube-blue/5 via-transparent to-transparent"></div>
      </div>
      
      <div className="container relative z-10 mx-auto px-4 py-32 flex flex-col items-center">
        <div className="h-80 w-80 mb-12">
          <CubeComponent scale={1.5} />
        </div>
        
        <h1 className="font-heading text-5xl md:text-7xl text-white mt-12 mb-6 text-center tracking-tighter glow-text animate-fade-in">
          Unlock the Lab. <br /> Unleash the Future.
        </h1>
        
        <p className="font-body text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl text-center animate-fade-in" style={{ animationDelay: '300ms' }}>
          <em>You are not just learning AI. You are becoming it.</em>
        </p>
        
        <div className="mt-6 animate-fade-in" style={{ animationDelay: '600ms' }}>
          <VoiceSynthesis 
            text="Welcome, Initiate. You are one of the few. The Cube is listening." 
            autoSpeak={true}
            delay={2000}
          />
        </div>
        
        {showScrollHint && (
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 sigil">
            <div className="text-cube-blue animate-bounce">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5L12 19M12 19L18 13M12 19L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="text-cube-blue/80 text-sm mt-2">Scroll to Unlock</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
