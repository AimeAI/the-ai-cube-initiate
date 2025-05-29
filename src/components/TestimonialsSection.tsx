import React from 'react';

interface Testimonial {
  name: string;
  age: number;
  quote: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Leo",
    age: 10,
    quote: "I made my own AI character for a story! The AI Cube showed me how to design it and make it smart. It's like magic!",
    image: "https://images.unsplash.com/photo-1587616211892-f39c5c782664?auto=format&fit=crop&w=150&q=80"
  },
  {
    name: "Mia",
    age: 12,
    quote: "The 'Predictor Engine' game was so cool! I learned how AI can guess things, and now I want to build my own prediction game.",
    image: "https://images.unsplash.com/photo-1595764292580-a5f8df6c38ad?auto=format&fit=crop&w=150&q=80"
  },
  {
    name: "Sam's Dad",
    age: 0, // Parent
    quote: "Sam is so engaged with The AI Cube. He's not just playing games; he's learning about AI ethics and creative problem-solving. It's fantastic!",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" // Placeholder parent image
  },
  {
    name: "Chloe",
    age: 9,
    quote: "I love the 'Neural Network Chamber'! It's like building a brain for my AI. I even taught it to recognize different shapes I drew!",
    image: "https://images.unsplash.com/photo-1595564709480-166e6a129075?auto=format&fit=crop&w=150&q=80"
  },
  {
    name: "Olivia's Mom",
    age: 0, // Parent
    quote: "The AI Cube has sparked a real passion for technology in Olivia. She's excited about creating her own AI projects and understands the importance of making AI fair and helpful.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" // Placeholder parent image
  },
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 relative bg-void-black text-text-primary" id="testimonials">
      {/* Subtle background pattern or gradient if desired */}
      <div className="absolute inset-0 bg-gradient-to-br from-obsidianBlack via-deepViolet/10 to-electricCyan/5 opacity-30"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in text-transparent bg-clip-text bg-gradient-to-r from-electricCyan to-neonMint">
            Echoes from the Cube: Voices of Creation
          </h2>
          <p className="text-gray-300 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Discover how The AI Cube is empowering individuals to build new realities and shape the future of intelligence.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-void-black/50 backdrop-blur-lg rounded-xl shadow-xl p-6 animate-fade-in border border-purple-500/30 hover:border-purple-400/70 transition-all duration-300"
              style={{ animationDelay: `${0.2 + index * 0.15}s` }}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-500/70 shadow-lg">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="mb-2">
                    <h4 className="font-bold text-purple-400 text-lg">
                      {testimonial.name}
                      {testimonial.age > 0 && <span className="ml-2 text-neonMint/80 text-sm">({testimonial.age} years)</span>}
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
                  <p className="text-gray-300 italic text-sm leading-relaxed">"{testimonial.quote}"</p>
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