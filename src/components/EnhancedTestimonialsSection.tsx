import React, { useState, useEffect } from 'react';
import { MythCard } from './myth/MythCard';
import { MythButton } from './myth/MythButton';
import { 
  Star, 
  Quote, 
  ChevronLeft, 
  ChevronRight, 
  Award,
  Users,
  TrendingUp,
  Heart,
  Play
} from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  rating: number;
  quote: string;
  highlight: string;
  childAge?: string;
  verified: boolean;
  avatar: string;
  gamesMentioned?: string[];
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah M.',
    role: 'Parent',
    location: 'California',
    rating: 5,
    quote: "My 10-year-old daughter now explains neural networks to her friends. She plays this more than Roblox! The way AI Cube makes complex concepts simple is incredible.",
    highlight: "She plays this more than Roblox!",
    childAge: '10 years old',
    verified: true,
    avatar: 'S',
    gamesMentioned: ['Neural Network Chamber', 'Snake³']
  },
  {
    id: '2',
    name: 'Mike R.',
    role: 'Homeschool Dad',
    location: 'Texas',
    rating: 5,
    quote: "Finally, an AI course that doesn't put kids to sleep! Both my boys are obsessed and actually learning. The parent dashboard helps me track their progress perfectly.",
    highlight: "Both my boys are obsessed and actually learning",
    childAge: '8 & 12 years old',
    verified: true,
    avatar: 'M',
    gamesMentioned: ['Crystal Resonance', 'Quantum Chamber']
  },
  {
    id: '3',
    name: 'Jennifer L.',
    role: 'Parent',
    location: 'New York',
    rating: 5,
    quote: "The parent dashboard helps me track progress and start amazing conversations about AI with my kids. They're learning concepts I didn't understand until college!",
    highlight: "Learning concepts I didn't understand until college!",
    childAge: '9 & 14 years old',
    verified: true,
    avatar: 'J',
    gamesMentioned: ['Decision Tree Game', 'Vision System']
  },
  {
    id: '4',
    name: 'David K.',
    role: 'Software Engineer & Dad',
    location: 'Seattle',
    rating: 5,
    quote: "As a developer, I'm impressed by the technical accuracy. My daughter is learning real AI concepts, not just playing games. This is the future of education.",
    highlight: "Learning real AI concepts, not just playing games",
    childAge: '11 years old',
    verified: true,
    avatar: 'D',
    gamesMentioned: ['Neural Forge', 'Predictor Engine']
  },
  {
    id: '5',
    name: 'Maria S.',
    role: 'Teacher & Mom',
    location: 'Florida',
    rating: 5,
    quote: "I use AI Cube in my classroom and at home. The age-adaptive learning is brilliant - it challenges my 6-year-old differently than my 13-year-old, but both are engaged.",
    highlight: "Age-adaptive learning is brilliant",
    childAge: '6 & 13 years old',
    verified: true,
    avatar: 'M',
    gamesMentioned: ['Snake³', 'Reinforcement Lab']
  },
  {
    id: '6',
    name: 'Robert T.',
    role: 'Parent',
    location: 'Colorado',
    rating: 5,
    quote: "My shy daughter has become confident talking about AI and technology. She even wants to study computer science now! AI Cube sparked a passion I never expected.",
    highlight: "She even wants to study computer science now!",
    childAge: '15 years old',
    verified: true,
    avatar: 'R',
    gamesMentioned: ['Ethics Framework', 'Generative Core']
  }
];

interface EnhancedTestimonialsSectionProps {
  showCTA?: boolean;
  autoRotate?: boolean;
  className?: string;
}

const EnhancedTestimonialsSection: React.FC<EnhancedTestimonialsSectionProps> = ({
  showCTA = true,
  autoRotate = true,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-rotation
  useEffect(() => {
    if (!autoRotate || isHovered) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [autoRotate, isHovered]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const currentTestimonial = testimonials[currentIndex];

  const handleTryFreeClick = () => {
    const tryFreeSection = document.getElementById('try-free');
    if (tryFreeSection) {
      tryFreeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePricingClick = () => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className={`py-16 md:py-20 bg-gradient-to-b from-myth-background to-myth-surface/20 ${className}`}>
      <div className="w-full max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-6 py-2 mb-6">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="text-yellow-400 font-semibold">Trusted by 2,847+ Families</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-myth-accent mb-4">
            Loved by Families Worldwide
          </h2>
          
          <div className="flex justify-center items-center gap-2 mb-8">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
            ))}
            <span className="text-xl font-bold text-myth-textPrimary ml-2">4.9/5</span>
            <span className="text-myth-textSecondary ml-2">(1,247 reviews)</span>
          </div>
        </div>
        
        {/* Featured Testimonial */}
        <div 
          className="relative max-w-4xl mx-auto mb-12"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <MythCard className="p-8 md:p-12 text-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-electricCyan/5 to-neonMint/5 pointer-events-none" />
            
            {/* Quote icon */}
            <div className="absolute top-6 left-6 opacity-20">
              <Quote className="w-12 h-12 text-myth-accent" />
            </div>
            
            {/* Rating */}
            <div className="flex justify-center items-center gap-1 mb-6">
              {[...Array(currentTestimonial.rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            
            {/* Quote */}
            <blockquote className="text-xl md:text-2xl text-myth-textPrimary mb-8 leading-relaxed italic relative z-10">
              "{currentTestimonial.quote}"
            </blockquote>
            
            {/* Highlight */}
            <div className="bg-gradient-to-r from-electricCyan/20 to-neonMint/20 border border-electricCyan/30 rounded-lg p-4 mb-8">
              <p className="text-electricCyan font-semibold text-lg">
                "{currentTestimonial.highlight}"
              </p>
            </div>
            
            {/* Author info */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-electricCyan to-neonMint rounded-full flex items-center justify-center text-obsidianBlack font-bold text-xl">
                {currentTestimonial.avatar}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-myth-textPrimary text-lg">
                    {currentTestimonial.name}
                  </p>
                  {currentTestimonial.verified && (
                    <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-semibold">
                      Verified
                    </div>
                  )}
                </div>
                <p className="text-myth-textSecondary">
                  {currentTestimonial.role} • {currentTestimonial.location}
                </p>
                {currentTestimonial.childAge && (
                  <p className="text-sm text-myth-accent">
                    Child: {currentTestimonial.childAge}
                  </p>
                )}
              </div>
            </div>
            
            {/* Games mentioned */}
            {currentTestimonial.gamesMentioned && (
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {currentTestimonial.gamesMentioned.map((game, index) => (
                  <span 
                    key={index}
                    className="bg-myth-surface/50 text-myth-textSecondary px-3 py-1 rounded-full text-sm"
                  >
                    {game}
                  </span>
                ))}
              </div>
            )}
            
            {/* Navigation */}
            <div className="flex justify-center items-center gap-4">
              <button
                onClick={goToPrevious}
                className="p-2 rounded-full bg-myth-surface hover:bg-myth-accent/20 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5 text-myth-accent" />
              </button>
              
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'bg-electricCyan scale-125' 
                        : 'bg-myth-surface hover:bg-myth-accent/50'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              
              <button
                onClick={goToNext}
                className="p-2 rounded-full bg-myth-surface hover:bg-myth-accent/20 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5 text-myth-accent" />
              </button>
            </div>
          </MythCard>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-electricCyan/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-8 h-8 text-electricCyan" />
            </div>
            <div className="text-2xl font-bold text-myth-accent">2,847+</div>
            <div className="text-myth-textSecondary text-sm">Happy Families</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Star className="w-8 h-8 text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-myth-accent">4.9/5</div>
            <div className="text-myth-textSecondary text-sm">Average Rating</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-400/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-myth-accent">94%</div>
            <div className="text-myth-textSecondary text-sm">Recommend to Friends</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-neonMint/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Heart className="w-8 h-8 text-neonMint" />
            </div>
            <div className="text-2xl font-bold text-myth-accent">89%</div>
            <div className="text-myth-textSecondary text-sm">Kids Love It</div>
          </div>
        </div>
        
        {/* CTA Section */}
        {showCTA && (
          <div className="text-center">
            <p className="text-lg text-myth-textSecondary mb-6">
              Join thousands of families giving their children the AI advantage
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button onClick={handleTryFreeClick}>
                <MythButton 
                  className="bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack text-lg px-8 py-4 flex items-center gap-2 font-bold transform hover:scale-105 transition-all duration-300"
                  label={
                    <>
                      <Play className="w-5 h-5" />
                      Try 3 Games FREE
                    </>
                  }
                />
              </button>
              
              <button onClick={handlePricingClick}>
                <MythButton 
                  className="border-2 border-myth-accent text-myth-accent hover:bg-myth-accent/10 px-8 py-4 transition-all duration-300"
                  label={
                    <>
                      <Award className="w-5 h-5" />
                      Join These Families
                    </>
                  }
                />
              </button>
            </div>
            
            <p className="text-sm text-gray-500 mt-3">
              Start with 3 free games • No credit card required
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default EnhancedTestimonialsSection;
