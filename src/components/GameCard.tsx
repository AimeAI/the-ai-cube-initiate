import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Game } from '@/games'; // Assuming Game interface is in games.ts
import { Gamepad2 } from 'lucide-react'; // Added import for Gamepad2

interface GameCardProps {
  game: Game;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  return (
    <Card className="bg-gradient-to-br from-deepViolet/30 via-obsidianBlack to-deepViolet/30 border border-electricCyan/20 shadow-xl shadow-electricCyan/20 hover:shadow-neonMint/30 transition-all duration-300 flex flex-col h-full rounded-xl backdrop-blur-sm overflow-hidden group">
      <CardHeader className="p-4">
        <CardTitle className="text-2xl font-orbitron font-bold text-electricCyan group-hover:text-neonMint transition-colors duration-300 [text-shadow:0_0_8px_var(--electricCyan)]">{game.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <div className="w-full h-40 bg-obsidianBlack/50 border border-electricCyan/30 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
          {/* Placeholder for game preview image/animation - can be enhanced later */}
          <Gamepad2 className="w-16 h-16 text-electricCyan/50 group-hover:text-neonMint/70 transition-colors duration-300" />
        </div>
        <p className="text-electricCyan/80 text-sm mb-4 font-inter">{game.description}</p>
      </CardContent>
      <CardFooter className="p-4 mt-auto">
        <Button
          asChild
          variant="outline"
          className="w-full bg-electricCyan/10 hover:bg-neonMint/20 text-neonMint hover:text-electricCyan border-neonMint/50 hover:border-electricCyan rounded-lg font-orbitron font-semibold py-3 px-4 transition-all duration-300 shadow-md hover:shadow-lg shadow-neonMint/30 hover:shadow-electricCyan/40 focus:ring-electricCyan"
        >
          <Link to={game.path}>Play Game</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GameCard;