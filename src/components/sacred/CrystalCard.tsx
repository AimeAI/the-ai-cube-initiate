import React from 'react';

interface CrystalCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glow?: 'blue' | 'purple' | 'orange' | 'cyan' | 'violet' | 'gold'; // Added more glow options based on axis/node colors
}

const CrystalCard: React.FC<CrystalCardProps> = ({
  children,
  glow = 'blue',
  className,
  ...props
}) => {
  const glowColorMapping = {
    blue: 'border-blue-400/30 shadow-[0_0_40px_rgba(0,212,255,0.15)] hover:shadow-[0_0_60px_rgba(0,212,255,0.25)]', // Default from prompt
    purple: 'border-purple-400/30 shadow-[0_0_40px_rgba(139,92,246,0.15)] hover:shadow-[0_0_60px_rgba(139,92,246,0.25)]', // --axis-y
    orange: 'border-orange-400/30 shadow-[0_0_40px_rgba(255,107,53,0.15)] hover:shadow-[0_0_60px_rgba(255,107,53,0.25)]', // --axis-z
    cyan: 'border-cyan-400/30 shadow-[0_0_40px_rgba(0,212,255,0.15)] hover:shadow-[0_0_60px_rgba(0,212,255,0.25)]', // --axis-x
    violet: 'border-violet-400/30 shadow-[0_0_40px_rgba(139,92,246,0.15)] hover:shadow-[0_0_60px_rgba(139,92,246,0.25)]', // --axis-y (alias)
    gold: 'border-yellow-400/30 shadow-[0_0_40px_rgba(255,215,0,0.15)] hover:shadow-[0_0_60px_rgba(255,215,0,0.25)]', // --node-core
  };

  const baseClasses = `
    relative p-6
    bg-gradient-to-br from-void-black/90 via-void-black/70 to-transparent
    rounded-xl backdrop-blur-lg
    transition-all duration-500
  `;

  const glowClasses = glowColorMapping[glow] || glowColorMapping.blue; // Fallback to blue if invalid glow prop

  const combinedClasses = `${baseClasses} ${glowClasses} ${className || ''}`;

  return (
    <div className={combinedClasses.trim()} {...props}>
      {children}
    </div>
  );
};

export default CrystalCard;