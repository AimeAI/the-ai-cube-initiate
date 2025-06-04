import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react'; // Using lucide-react for the Home icon

const HomeButton: React.FC = () => {
  return (
    <Link
      to="/dashboard/student"
      className="fixed top-6 left-6 z-[1000] p-3 bg-gradient-to-r from-axis-y to-axis-x text-crystal-white font-semibold rounded-full shadow-lg hover:from-purple-500 hover:to-cyan-500 transition-all duration-300 transform hover:scale-110 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-energy-glow focus:ring-offset-2 focus:ring-offset-void-black pointer-events-auto"
      aria-label="Go to Student Dashboard"
      style={{ width: '56px', height: '56px' }} // Explicit size for a circular button
    >
      <Home size={28} strokeWidth={2.5} />
    </Link>
  );
};

export default HomeButton;