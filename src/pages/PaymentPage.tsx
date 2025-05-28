import React from 'react';
import Navigation from '@/components/Navigation';
import { Link } from 'react-router-dom'; // Import Link

const PaymentPage: React.FC = () => {
  return (
    <div className="bg-void-black text-text-primary min-h-screen overflow-x-hidden">
      <Navigation />
      <div className="container mx-auto px-4 py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          Join The AI Cube
        </h1>
        <p className="text-gray-300 mb-12 max-w-2xl mx-auto">
          Select your desired key and unlock the power to build your own AI myths. Secure payment processing via Stripe and account management via Supabase.
        </p>
        
        {/* Placeholder for Stripe and Supabase integration */}
        <div className="bg-purple-900/20 border border-purple-700/50 p-8 rounded-lg max-w-md mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-white">Payment & Sign Up</h2>
          <p className="text-gray-400 mb-4">
            Stripe payment form and Supabase sign-up/login will be integrated here.
          </p>
          <button
            className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:from-purple-500 hover:to-pink-500 hover:shadow-xl transform hover:scale-105"
          >
            Proceed to Payment (Placeholder)
          </button>
          <Link
            to="/"
            className="mt-6 inline-block w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 bg-gray-700 text-white shadow-md hover:bg-gray-600 hover:shadow-lg transform hover:scale-105"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;