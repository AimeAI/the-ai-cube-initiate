import React from 'react';
import { Button } from '@/components/ui/button'; // Assuming you have a Button component

const FeedbackButton: React.FC = () => {
  const feedbackFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSfnJKSL7lTJr8zKx43R6vB86EK4sBG-jtpaK3Lcg_Y7F-zNTw/viewform?embedded=true";

  return (
    <section className="py-8 md:py-12 bg-myth-darker text-center">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-myth-textPrimary mb-6">
          Help Us Improve!
        </h2>
        <p className="text-myth-textSecondary mb-8 max-w-2xl mx-auto">
          We value your input. Please take a moment to share your anonymous feedback on our beta.
        </p>
        <Button
          onClick={() => window.open(feedbackFormUrl, '_blank', 'noopener,noreferrer')}
          variant="default" // Changed from "primary" to "default"
          size="lg" // Or your desired button size
          className="bg-myth-primary hover:bg-myth-primary-dark text-white font-semibold"
        >
          Submit Beta Anonymous Feedback
        </Button>
      </div>
    </section>
  );
};

export default FeedbackButton;