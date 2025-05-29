import React from 'react';

interface CubeThemeProviderProps {
  children: React.ReactNode;
}

const CubeThemeProvider: React.FC<CubeThemeProviderProps> = ({ children }) => {
  return (
    <div
      className="min-h-screen bg-background text-foreground antialiased"
      lang="en"
      dir="ltr"
    >
      {children}
    </div>
  );
};

export default CubeThemeProvider;