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
    expect(button).toHaveClass('inline-flex items-center justify-center rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50');
  });

  it('applies the correct classes for the default "primary" variant', () => {
    render(<SacredButton>Test</SacredButton>);
    const button = screen.getByRole('button', { name: /test/i });
    expect(button).toHaveClass('bg-primary text-primary-foreground hover:bg-primary/90');
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