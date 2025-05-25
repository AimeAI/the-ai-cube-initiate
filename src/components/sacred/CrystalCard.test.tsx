import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CrystalCard from './CrystalCard';

describe('CrystalCard', () => {
  it('renders with its children', () => {
    render(<CrystalCard>Hello World</CrystalCard>);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('applies the correct base classes', () => {
    const { container } = render(<CrystalCard>Test</CrystalCard>);
    const cardElement = container.firstChild;
    expect(cardElement).toHaveClass('relative p-6 bg-gradient-to-br from-void-black/90 via-void-black/70 to-transparent rounded-xl backdrop-blur-lg transition-all duration-500');
  });

  it('applies the correct classes for the default "blue" glow variant', () => {
    const { container } = render(<CrystalCard>Test</CrystalCard>);
    const cardElement = container.firstChild;
    expect(cardElement).toHaveClass('border-blue-400/30 shadow-[0_0_40px_rgba(0,212,255,0.15)] hover:shadow-[0_0_60px_rgba(0,212,255,0.25)]');
  });

  it('applies the correct classes for "purple" glow variant', () => {
    const { container } = render(<CrystalCard glow="purple">Test</CrystalCard>);
    const cardElement = container.firstChild;
    expect(cardElement).toHaveClass('border-purple-400/30 shadow-[0_0_40px_rgba(139,92,246,0.15)] hover:shadow-[0_0_60px_rgba(139,92,246,0.25)]');
  });

  it('applies the correct classes for "gold" glow variant', () => {
    const { container } = render(<CrystalCard glow="gold">Test</CrystalCard>);
    const cardElement = container.firstChild;
    expect(cardElement).toHaveClass('border-yellow-400/30 shadow-[0_0_40px_rgba(255,215,0,0.15)] hover:shadow-[0_0_60px_rgba(255,215,0,0.25)]');
  });

  it('falls back to "blue" glow if an invalid glow prop is provided', () => {
    // @ts-expect-error Testing invalid prop
    const { container } = render(<CrystalCard glow="invalid-glow">Test</CrystalCard>);
    const cardElement = container.firstChild;
    expect(cardElement).toHaveClass('border-blue-400/30 shadow-[0_0_40px_rgba(0,212,255,0.15)] hover:shadow-[0_0_60px_rgba(0,212,255,0.25)]');
  });
});