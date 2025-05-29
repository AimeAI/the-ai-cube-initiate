import React from 'react';

interface MythButtonProps {
  label: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
}

export const MythButton: React.FC<MythButtonProps> = ({
  label,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`px-6 py-3 rounded-lg bg-gradient-to-r from-myth-accent to-myth-secondary text-myth-textPrimary font-bold shadow-lg hover:shadow-myth-accent/50 transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  >
    {label}
  </button>
);