import React, { useEffect, useState, lazy, Suspense } from 'react';
import * as Tone from 'tone';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { initializeEnvironment } from "@/utils/envValidation";
import { initializeMonitoring } from "@/utils/monitoring";

// Eagerly loaded core pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/login";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import GuestMode from "./components/GuestMode";

// Lazy loaded pages
const GamesHub = lazy(() => import("./pages/GamesHub"));
const StudentDashboard = lazy(() => import("./pages/StudentDashboard"));
const ParentPortal = lazy(() => import("./pages/ParentPortal"));
const PaymentPage = lazy(() => import("./pages/PaymentPage"));
const ParentProfilePage = lazy(() => import("./pages/ParentProfile"));
const PricingPage = lazy(() => import("./pages/PricingPage"));

// Enhanced child-friendly game routes
const EnhancedSnake3Game = lazy(() => import("./routes/EnhancedSnake3Game"));
const EnhancedCrystalResonance = lazy(() => import("./routes/EnhancedCrystalResonance"));
const EnhancedNeuralNetworkChamber = lazy(() => import("./routes/EnhancedNeuralNetworkChamber"));

// Original game routes (to be enhanced)
const VisionSystem = lazy(() => import("./routes/VisionSystem"));
const EthicsFramework = lazy(() => import("./routes/EthicsFramework"));
const ClassifierConstruct = lazy(() => import("./routes/ClassifierConstruct"));
const GenerativeCore = lazy(() => import("./routes/GenerativeCore"));
const DecisionTreeGame = lazy(() => import("./routes/DecisionTreeGame"));
const FoundersChambersModule1 = lazy(() => import("./modules/founders-chamber/FoundersChambersModule1"));
const NeuralForge = lazy(() => import("./routes/NeuralForge"));
const NeuralPathways = lazy(() => import("./routes/NeuralPathways"));
const PredictorEngineGame = lazy(() => import("./routes/PredictorEngineGame"));
const QuantumChamberGame = lazy(() => import("./routes/QuantumChamberGame"));
const ReinforcementLab = lazy(() => import("./routes/ReinforcementLab"));
const TrajectoryGame = lazy(() => import("./routes/TrajectoryGame"));

import MysticalBackground from "./components/sacred/MysticalBackground";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";
import LoadingFallback from "./components/ui/LoadingFallback";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

import { Button } from "@/components/ui/button";
import PerformanceMonitor from "./components/PerformanceMonitor";
import { initializeResourcePreloading, preloadRouteResources } from "@/utils/resourcePreloader";
import PageTransition from "./components/PageTransition";
const queryClient = new QueryClient();

const App = () => {
  const [guestEmail, setGuestEmail] = useState<string | null>(null);

  // Initialize and validate environment on app startup
  useEffect(() => {
    try {
      initializeEnvironment();
      
      // Initialize monitoring systems
      const { errorTracker, performanceMonitor, healthChecker } = initializeMonitoring();
      
      // Initialize resource preloading
      initializeResourcePreloading();
      
      // Record app startup metric
      performanceMonitor.recordMetric({
        name: 'app.startup',
        value: performance.now(),
        unit: 'ms',
        timestamp: new Date(),
        tags: { environment: import.meta.env.MODE }
      });
      
    } catch (error) {
      console.error('❌ Environment validation failed:', error);
      // In production, you might want to show an error page
      // For now, we'll log and continue
    }
  }, []);

  const handleGuestEmailCapture = (email: string) => {
    setGuestEmail(email);
    // Store for later conversion
    localStorage.setItem('guestEmail', email);
    // Could send to analytics or email service here
  };

  const handleGuestUpgrade = () => {
    // Navigate to signup with pre-filled email
    window.location.href = `/login?email=${encodeURIComponent(guestEmail || '')}`;
  };

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <MysticalBackground isActive={true} particleColorVars={['--electricCyan', '--neonMint']} particleCount={30} className="opacity-50" />
            <header>
              {/* Placeholder for global navigation. Will be addressed in a subsequent step if Navigation.tsx is global. */}
            </header>
            <main className="relative z-0"> {/* Ensure main content is above background */}
              <ErrorBoundary>
                <Suspense fallback={<LoadingFallback message="Loading page..." />}>
                  <PageTransition>
                    <Routes>
                    
                      <Route path="/" element={<Index />} />                    {/* Guest Mode - No authentication required */}
                    <Route path="/try-free" element={
                      <GuestMode 
                        onEmailCapture={handleGuestEmailCapture}
                        onUpgrade={handleGuestUpgrade}
                      />
                    } />
                    
                    {/* Enhanced Child-Friendly Games - Available in guest mode */}
                    <Route path="/games/snake-3" element={<EnhancedSnake3Game />} />
                    <Route path="/games/crystal-resonance" element={<EnhancedCrystalResonance />} />
                    <Route path="/games/neural-network-chamber" element={<EnhancedNeuralNetworkChamber />} />
                    
                    {/* Protected routes - require authentication */}
                    <Route path="/games" element={<ProtectedRoute><GamesHub /></ProtectedRoute>} />
                    <Route path="/games/classifier-construct" element={<ProtectedRoute><ClassifierConstruct /></ProtectedRoute>} />
                    <Route path="/ethics-framework" element={<ProtectedRoute><EthicsFramework /></ProtectedRoute>} />
                    <Route path="/generative-core" element={<ProtectedRoute><GenerativeCore /></ProtectedRoute>} />
                    <Route path="/games/decision-tree" element={<ProtectedRoute><DecisionTreeGame /></ProtectedRoute>} />
                    <Route path="/dashboard/student" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
                    <Route path="/dashboard/parent" element={<ProtectedRoute requiresSubscription={false}><ParentPortal /></ProtectedRoute>} />
                    <Route path="/games/vision-system" element={<ProtectedRoute><VisionSystem /></ProtectedRoute>} />
                    <Route path="/founders-chamber-module-1" element={<ProtectedRoute><FoundersChambersModule1 /></ProtectedRoute>} />
                    <Route path="/games/neural-forge" element={<ProtectedRoute><NeuralForge /></ProtectedRoute>} />
                    <Route path="/games/neural-pathways" element={<ProtectedRoute><NeuralPathways /></ProtectedRoute>} />
                    <Route path="/games/predictor-engine" element={<ProtectedRoute><PredictorEngineGame /></ProtectedRoute>} />
                    <Route path="/games/quantum-chamber" element={<ProtectedRoute><QuantumChamberGame /></ProtectedRoute>} />
                    <Route path="/games/reinforcement-lab" element={<ProtectedRoute><ReinforcementLab /></ProtectedRoute>} />
                    <Route path="/payment" element={<ProtectedRoute requiresSubscription={false}><PaymentPage /></ProtectedRoute>} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/profile/parent" element={<ProtectedRoute requiresSubscription={false}><ParentProfilePage /></ProtectedRoute>} />
                    <Route path="/games/trajectory" element={<ProtectedRoute><TrajectoryGame /></ProtectedRoute>} />
                    
                    {/* Admin routes */}
                    <Route path="/admin/games" element={<AdminProtectedRoute requiresSubscription={false}><GamesHub /></AdminProtectedRoute>} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="*" element={<NotFound />} />
                    </Routes>
                  </PageTransition>
                </Suspense>
              </ErrorBoundary>
            </main>
            <footer>
              {/* Placeholder for global footer. */}
            </footer>
          </BrowserRouter>
          <PerformanceMonitor />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
