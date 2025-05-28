import React from 'react';

interface ValueCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay: number;
}

const ValueCard: React.FC<ValueCardProps> = ({ title, description, icon, delay }) => {
  return (
    <div
      className="bg-void-black/30 backdrop-blur-md p-6 rounded-lg shadow-xl border border-purple-500/30 hover:border-purple-400/70 transition-all duration-300 animate-fade-in"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
        <div className="w-16 h-16 flex-shrink-0 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2 text-purple-400">{title}</h3>
          <p className="text-gray-300">{description}</p>
        </div>
      </div>
    </div>
  );
};

const ValueSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-void-black text-text-primary" id="value">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            The AI Cube: Forge Your Myth
          </h2>
          <p className="text-gray-300 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            The AI Cube is not merely a tool; it's a crucible for creation, a trainer for the architects of tomorrow's intelligence. Here, you will hone the skills of myth-building, shaping the future with knowledge, creativity, and vision.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <ValueCard 
            title="Forge Future-Proof Skills"
            description="In a world increasingly driven by AI, The AI Cube equips you with the knowledge and practical skills to not only understand these technologies, but to create and lead with them."
            icon={
              <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
            delay={0.2}
          />
          
          <ValueCard 
            title="Master Creative Problem Solving"
            description="AI Cube challenges foster critical thinking, encouraging you to approach problems from multiple perspectives and develop innovative, mythic solutions."
            icon={
              <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            }
            delay={0.4}
          />
          
          <ValueCard 
            title="Champion Ethical AI"
            description="We believe in responsible innovation. Learn to consider the ethical implications of AI and develop a strong foundation in creating fair, unbiased, and beneficial AI systems that build positive myths."
            icon={
              <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
            delay={0.6}
          />
          
          <ValueCard 
            title="Cultivate a Creator's Mindset"
            description="The AI Cube inspires you to think like a myth-maker, identify opportunities, and build your own AI ventures that can solve real-world problems and shape the future."
            icon={
              <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
            delay={0.8}
          />
        </div>
      </div>
    </section>
  );
};

export default ValueSection;