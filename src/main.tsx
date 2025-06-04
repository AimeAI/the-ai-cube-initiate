import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n'; // Import i18next configuration
import './styles/sacred-ai-theme.css'; // Import the new theme
import CubeThemeProvider from './components/theme/CubeThemeProvider';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '../hooks/useAuth'; // Corrected path

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <AuthProvider>
      <CubeThemeProvider>
        <App />
      </CubeThemeProvider>
    </AuthProvider>
  </HelmetProvider>
);
