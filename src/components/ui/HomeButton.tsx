import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react'; // Using lucide-react for the Home icon

const HomeButton: React.FC = () => {
  return (
    <Link
      to="/"
      className="fixed top-6 left-6 z-[1000] p-3 bg-gradient-to-r from-electricCyan to-neonMint text-obsidianBlack font-semibold rounded-full shadow-lg hover:from-neonMint hover:to-electricCyan transition-all duration-300 transform hover:scale-110 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-electricCyan focus:ring-offset-2 focus:ring-offset-myth-background pointer-events-auto"
      aria-label="Go to Home"
      style={{ width: '56px', height: '56px' }} // Explicit size for a circular button
    >
      <Home size={28} strokeWidth={2.5} />
    </Link>
  );
};

export default HomeButton;