/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

describe('App component', () => {
  test('renders header, main, and footer landmarks', () => {
    render(<App />);

    const headerElement = screen.getByRole('banner'); // 'banner' is the implicit role for <header>
    expect(headerElement).toBeInTheDocument();

    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();

    const footerElement = screen.getByRole('contentinfo'); // 'contentinfo' is the implicit role for <footer>
    expect(footerElement).toBeInTheDocument();
  });
});