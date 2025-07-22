import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SacredButton from './SacredButton';

describe('SacredButton', () => {
  it('renders with its children', () => {
    render(<SacredButton>Click Me</SacredButton>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('applies the correct base classes', () => {
    render(<SacredButton>Test</SacredButton>);
    const button = screen.getByRole('button', { name: /test/i });
    expect(button).toHaveClass('inline-flex items-center justify-center rounded-md font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50');
  });

  it('applies the correct classes for the default "primary" variant', () => {
    render(<SacredButton>Test</SacredButton>);
    const button = screen.getByRole('button', { name: /test/i });
    expect(button).toHaveClass('bg-[#1e3a8a] text-white hover:bg-[#1e40af] shadow-lg shadow-blue-900/30 border border-blue-700/50 hover:shadow-xl hover:shadow-blue-800/40 hover:scale-105 transform');
  });

  it('applies the correct classes for the "secondary" variant when specified', () => {
    render(<SacredButton variant="secondary">Test</SacredButton>);
    const button = screen.getByRole('button', { name: /test/i });
    expect(button).toHaveClass('bg-secondary text-secondary-foreground hover:bg-secondary/80');
  });

  it('renders as an <a> tag if href prop is provided', () => {
    render(<SacredButton href="/test-link">Link</SacredButton>);
    const linkElement = screen.getByRole('link', { name: /link/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement.tagName).toBe('A');
    expect(linkElement).toHaveAttribute('href', '/test-link');
  });
});