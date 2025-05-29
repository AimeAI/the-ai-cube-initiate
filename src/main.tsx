import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import CubeThemeProvider from './components/theme/CubeThemeProvider';
import { HelmetProvider } from 'react-helmet-async';

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <CubeThemeProvider>
      <App />
    </CubeThemeProvider>
  </HelmetProvider>
);
