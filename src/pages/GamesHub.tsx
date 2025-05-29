import React from 'react';
import { useNavigate } from 'react-router-dom';
import { games, Game } from '../gamesConfig'; // Assuming gamesConfig is in src
import { useTranslation } from 'react-i18next';
import { MythGameCard } from '@/components/myth/MythGameCard'; // Import MythGameCard

const GamesHub: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4 text-myth-textPrimary">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-orbitron font-bold mb-2 text-myth-accent">{t('gamesHub.title', 'Games Hub')}</h1>
        <p className="text-lg text-myth-textSecondary">
          {t('gamesHub.description', 'Explore our collection of interactive games and experiences.')}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game: Game) => (
          <MythGameCard
            key={game.id}
            name={t(game.name, game.name)}
            status="unlocked" // Default status as it's not in gameConfig
            icon={<span className="text-3xl">🎮</span>} // Placeholder icon
            onClick={() => navigate(game.path)}
            // Add hover pulse animation via className if defined in tailwind.config.ts
            // e.g., className="animate-glow-pulse" or a custom pulse for cards
          />
        ))}
      </div>
    </div>
  );
};

export default GamesHub;