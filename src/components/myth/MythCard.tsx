import React from 'react';

interface MythCardProps {
  title: string;
  children: React.ReactNode;
}

export const MythCard: React.FC<MythCardProps> = ({ title, children }) => (
  <div className="bg-myth-surface border border-myth-accent/20 rounded-xl p-6 shadow-glow hover:shadow-[0_0_40px_#00f7ffaa] transition-all backdrop-blur-md">
    <h3 className="text-myth-accent font-orbitron tracking-widest uppercase text-sm mb-3">{title}</h3>
    <div className="text-myth-textSecondary">{children}</div>
  </div>
);