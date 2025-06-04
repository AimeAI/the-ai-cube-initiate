import React from 'react';

interface Testimonial {
  name: string;
  age: number; // 0 for parent
  quote: string;
  image: string;
  sourceType: 'kid' | 'parent'; // To differentiate styling or emphasis
  gameName?: string; // Optional: To link testimonial to a specific game
}

// Placeholder avatar URLs - replace with actual cartoon avatars or a dynamic service
// const avatarBaseUrl = "https://api.dicebear.com/8.x/micah/svg?seed="; // Commented out as we'll use initials for kids

const testimonials: Testimonial[] = [
  {
    name: "Leo",
    age: 10,
    quote: "Building my own AI character in Neural Forge was epic! I learned how to design its 'brain' and make it smart for my stories. It felt like real magic!",
    image: "", // Empty for kids, will use initials
    sourceType: 'kid',
    gameName: 'Neural Forge',
  },
  {
    name: "Mia",
    age: 12,
    quote: "The Predictor Engine game blew my mind! Understanding how AI can forecast things was so cool. Now I'm buzzing with ideas for my own prediction game.",
    image: "", // Empty for kids, will use initials
    sourceType: 'kid',
    gameName: 'Predictor Engine',
  },
  {
    name: "Sam's Dad",
    age: 0, // Parent
    quote: "Sam is thoroughly captivated by The AI Cube. It's far more than play; he's grasping complex AI ethics and honing creative problem-solving skills through games like the Ethics Framework. The educational depth is remarkable.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    sourceType: 'parent',
    gameName: 'Ethics Framework', // Example, can be any relevant game
  },
  {
    name: "Chloe",
    age: 9,
    quote: "I adore the Neural Network Chamber! It’s like I'm an architect for an AI's mind. I even taught my AI to recognize the shapes I drew—it actually learned!",
    image: "", // Empty for kids, will use initials
    sourceType: 'kid',
    gameName: 'Neural Network Chamber',
  },
  {
    name: "Olivia's Mom",
    age: 0, // Parent
    quote: "The AI Cube has unlocked a genuine enthusiasm for tech in Olivia. She's not just thrilled to build AI projects in games like Generative Core, but she also deeply values making AI equitable and beneficial. It's an incredible learning journey.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    sourceType: 'parent',
    gameName: 'Generative Core', // Example
  },
  {
    name: "Alex",
    age: 11,
    quote: "Classifier Construct was awesome! It taught me how AI categorizes information. I built a model that could distinguish between different animals. Seeing it learn was fantastic!",
    image: "", // Empty for kids, will use initials
    sourceType: 'kid',
    gameName: 'Classifier Construct',
  },
  {
    name: "Ethan's Dad",
    age: 0,
    quote: "Ethan was captivated by Crystal Resonance. It's an artful way to introduce intricate concepts of data patterns and their significance. He's now asking more profound questions about how data shapes our world.",
    image: "https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&w=150&q=80",
    sourceType: 'parent',
    gameName: 'Crystal Resonance',
  },
  {
    name: "Sophia",
    age: 13,
    quote: "The Decision Tree game was a revelation! It showed me the logic behind AI choices, like a visual map for thinking. I feel it's even helped me make smarter decisions in real life.",
    image: "", // Empty for kids, will use initials
    sourceType: 'kid',
    gameName: 'Decision Tree Game',
  },
  {
    name: "Noah",
    age: 10,
    quote: "Exploring Neural Pathways felt like navigating a digital brain! I learned how connections and layers make AI intelligent. It's complex but incredibly fun to understand.",
    image: "", // Empty for kids, will use initials
    sourceType: 'kid',
    gameName: 'Neural Pathways',
  },
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 relative bg-void-black text-text-primary" id="testimonials">
      {/* Subtle background pattern or gradient if desired */}
      <div className="absolute inset-0 bg-gradient-to-br from-obsidianBlack via-deepViolet/10 to-electricCyan/5 opacity-30"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in text-transparent bg-clip-text bg-gradient-to-r from-electricCyan to-neonMint">
            Echoes from the Cube: Voices of Creation
          </h2>
          <p className="text-gray-300 animate-fade-in mb-8" style={{ animationDelay: '0.2s' }}>
            Discover how The AI Cube is empowering individuals to build new realities and shape the future of intelligence.
          </p>
        </div>

        <h3 className="text-xl md:text-2xl font-semibold mb-10 text-center text-neonMint animate-fade-in" style={{ animationDelay: '0.4s' }}>
          Voices from the Builders of Tomorrow
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-void-black/50 backdrop-blur-lg rounded-xl shadow-xl p-6 animate-fade-in border border-purple-500/30 hover:border-purple-400/70 transition-all duration-300"
              style={{ animationDelay: `${0.2 + index * 0.15}s` }}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-500/70 shadow-lg bg-deepViolet/30 flex items-center justify-center text-white text-2xl font-bold">
                    {testimonial.image ? (
                      <img
                        src={testimonial.image}
                        alt={`${testimonial.name}'s avatar`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{testimonial.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0"> {/* Added min-w-0 to help with flex item overflow */}
                  <div className="mb-2">
                    <h4 className="font-bold text-purple-400 text-lg break-words"> {/* Added break-words */}
                      {testimonial.name}
                      {testimonial.sourceType === 'kid' && testimonial.age > 0 && (
                        <span className="ml-2 text-neonMint/80 text-sm font-normal">({testimonial.age} years)</span>
                      )}
                       {testimonial.sourceType === 'parent' && (
                        <span className="ml-2 text-neonMint/80 text-sm font-normal">(Parent)</span>
                      )}
                    </h4>
                    <div className="flex items-center mt-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 italic text-sm leading-relaxed">
                    "{testimonial.quote}"
                    {testimonial.gameName && <span className="block text-xs text-electricCyan/70 mt-1 non-italic">Learned with: {testimonial.gameName}</span>}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Background Animation Elements - Themed for AI Cube */}
        <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-deepViolet/20 rounded-full animate-pulse opacity-30 filter blur-xl" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-electricCyan/20 rounded-full animate-pulse opacity-30 filter blur-xl" style={{ animationDelay: '1.2s' }}></div>
      </div>
    </section>
  );
};

export default TestimonialsSection;