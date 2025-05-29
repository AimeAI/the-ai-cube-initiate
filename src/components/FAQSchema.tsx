import React from 'react';
import { Helmet } from 'react-helmet-async';

const FAQSchema: React.FC = () => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What age group is AI Cube for?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "AI Cube is designed for kids and teenagers, typically in the age range of 8-16, but can be engaging for anyone interested in learning about AI through interactive simulations."
        }
      },
      {
        "@type": "Question",
        "name": "How does the simulation work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our simulations provide hands-on experience with AI concepts. Users can interact with different AI models, adjust parameters, and observe the outcomes, making learning intuitive and fun."
        }
      },
      {
        "@type": "Question",
        "name": "Is AI Cube free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "AI Cube offers a free tier with access to basic simulations. We also have premium plans with access to more advanced features, simulations, and learning content. Please check our pricing page for more details."
        }
      }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
    </Helmet>
  );
};

export default FAQSchema;