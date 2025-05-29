import React from 'react';

interface MythGameCardProps {
  name: string;
  status: 'unlocked' | 'locked' | 'coming soon'; // More specific status
  icon: React.ReactNode; // Allow for SVG icons or other elements
  previewImage?: string; // Optional: path to a preview image
  onClick?: () => void;
  className?: string;
}

export const MythGameCard: React.FC<MythGameCardProps> = ({
  name,
  status,
  icon,
  previewImage,
  onClick,
  className = '',
}) => {
  const statusColor =
    status === 'unlocked'
      ? 'text-myth-positive'
      : status === 'locked'
      ? 'text-myth-textSecondary/70' // Softer for locked
      : 'text-myth-warning'; // Coming soon in warning color

  return (
    <div
      onClick={onClick}
      className={`bg-myth-background hover:bg-myth-surface border border-myth-accent/10 p-4 rounded-xl shadow-md text-myth-textPrimary transition cursor-pointer hover:scale-105 hover:border-myth-accent/30 hover:shadow-glow ${className}`}
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-myth-accent text-lg font-orbitron">{name}</h2>
        <span className={`text-xs font-mono ${statusColor}`}>
          {status.toUpperCase()}
        </span>
      </div>
      <div className="text-myth-textSecondary/60 h-32 flex items-center justify-center overflow-hidden rounded-md mb-3 bg-myth-surface/50"> {/* Adjusted height for image/icon */}
        {previewImage ? (
          <img src={previewImage} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};