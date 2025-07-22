import React, { useEffect, useState, lazy, Suspense } from 'react';
import * as Tone from 'tone';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { initializeEnvironment } from "@/utils/envValidation";
import { initializeMonitoring } from "@/utils/monitoring";

// Advanced optimization providers
import AdvancedAnalyticsProvider from "@/components/AdvancedAnalytics";
import PersonalizationProvider from "@/components/PersonalizationEngine";
import ABTestingProvider from "@/components/ABTestingFramework";
import ConversionOptimizerProvider from "@/components/ConversionOptimizer";
import HeatmapTrackerComponent from "@/components/HeatmapTracker";

// Eagerly loaded core pages
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/login";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import GuestMode from "./components/GuestMode";

// Lazy loaded pages with advanced preloading
const Index = lazy(() => import("./pages/OptimizedSalesFunnelIndex"));
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
import SmoothLoader from "./components/SmoothLoader";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import PerformanceMonitor from "./components/PerformanceMonitor";
import { initializeResourcePreloading } from "@/utils/resourcePreloader";
import PageTransition from "./components/PageTransition";

// Advanced performance monitoring
interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  interactionTime: number;
  memoryUsage: number;
  networkLatency: number;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

const UltimateApp = () => {
  const [guestEmail, setGuestEmail] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);

  // Advanced initialization with comprehensive monitoring
  useEffect(() => {
    const initializeApp = async () => {
      const startTime = performance.now();
      
      try {
        // Environment validation
        initializeEnvironment();
        
        // Initialize monitoring systems
        const { errorTracker, performanceMonitor, healthChecker } = initializeMonitoring();
        
        // Initialize resource preloading
        initializeResourcePreloading();
        
        // Preload critical resources
        await preloadCriticalResources();
        
        // Initialize performance monitoring
        initializePerformanceMonitoring();
        
        // Initialize service worker for offline support
        if ('serviceWorker' in navigator) {
          try {
            await navigator.serviceWorker.register('/sw.js');
            console.log('✅ Service Worker registered');
          } catch (error) {
            console.warn('Service Worker registration failed:', error);
          }
        }
        
        // Record initialization metrics
        const initTime = performance.now() - startTime;
        performanceMonitor.recordMetric({
          name: 'app.initialization',
          value: initTime,
          unit: 'ms',
          timestamp: new Date(),
          tags: { 
            environment: import.meta.env.MODE,
            session_id: sessionId
          }
        });
        
        setIsInitialized(true);
        
      } catch (error) {
        console.error('❌ App initialization failed:', error);
        // Fallback initialization
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, [sessionId]);

  // Preload critical resources
  const preloadCriticalResources = async () => {
    const criticalResources = [
      '/assets/aicube2.mp4',
      '/assets/aicube3.mp4',
      '/assets/aicubevideo.mp4'
    ];

    const preloadPromises = criticalResources.map(resource => {
      return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = resource.endsWith('.mp4') ? 'video' : 'image';
        link.href = resource;
        link.onload = resolve;
        link.onerror = reject;
        document.head.appendChild(link);
      });
    });

    try {
      await Promise.allSettled(preloadPromises);
      console.log('✅ Critical resources preloaded');
    } catch (error) {
      console.warn('Some resources failed to preload:', error);
    }
  };

  // Initialize comprehensive performance monitoring
  const initializePerformanceMonitoring = () => {
    // Core Web Vitals monitoring
    if ('web-vital' in window) {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(console.log);
        getFID(console.log);
        getFCP(console.log);
        getLCP(console.log);
        getTTFB(console.log);
      });
    }

    // Memory usage monitoring
    if ('memory' in performance) {
      const memoryInfo = (performance as any).memory;
      setPerformanceMetrics(prev => ({
        ...prev,
        memoryUsage: memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit
      } as PerformanceMetrics));
    }

    // Network latency monitoring
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      console.log('Network info:', {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt
      });
    }

    // Frame rate monitoring
    let frameCount = 0;
    let lastTime = performance.now();
    
    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        console.log('FPS:', fps);
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    requestAnimationFrame(measureFPS);
  };

  // Guest mode handlers
  const handleGuestEmailCapture = (email: string) => {
    setGuestEmail(email);
    localStorage.setItem('guestEmail', email);
    
    // Track email capture
    if (window.analytics) {
      window.analytics.trackEvent({
        event: 'email_capture',
        category: 'Lead',
        action: 'capture',
        label: 'guest_mode',
        customParameters: {
          email_domain: email.split('@')[1],
          session_id: sessionId
        }
      });
    }
  };

  const handleGuestUpgrade = () => {
    window.location.href = `/login?email=${encodeURIComponent(guestEmail || '')}`;
  };

  // Show loading screen while initializing
  if (!isInitialized) {
    return (
      <SmoothLoader 
        isLoading={true}
        message="Initializing AI Cube platform..."
        variant="page"
        showProgress={true}
        progress={75}
      />
    );
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            {/* Advanced Analytics and Optimization Providers */}
            <AdvancedAnalyticsProvider>
              <PersonalizationProvider>
                <ABTestingProvider>
                  <ConversionOptimizerProvider>
                    
                    {/* Heatmap Tracking */}
                    <HeatmapTrackerComponent sessionId={sessionId} enabled={true} />
                    
                    {/* Toast Notifications */}
                    <Toaster />
                    <Sonner />
                    
                    {/* Enhanced Background */}
                    <MysticalBackground 
                      isActive={true} 
                      particleColorVars={['--electricCyan', '--neonMint']} 
                      particleCount={30} 
                      className="opacity-50" 
                    />
                    
                    {/* Main Application */}
                    <main className="relative z-0">
                      <ErrorBoundary>
                        <Suspense fallback={
                          <SmoothLoader 
                            isLoading={true}
                            message="Loading page..."
                            variant="page"
                          />
                        }>
                          <PageTransition>
                            <Routes>
                              {/* Main Homepage - Optimized Sales Funnel */}
                              <Route path="/" element={<Index />} />
                              
                              {/* Guest Mode - No authentication required */}
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
                    
                    {/* Advanced Performance Monitor */}
                    <PerformanceMonitor />
                    
                  </ConversionOptimizerProvider>
                </ABTestingProvider>
              </PersonalizationProvider>
            </AdvancedAnalyticsProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
      
      {/* Advanced CSS for performance and UX */}
      <style jsx global>{`
        /* Performance optimizations */
        * {
          box-sizing: border-box;
        }
        
        html {
          scroll-behavior: smooth;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }
        
        /* Optimize animations for performance */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
        
        /* GPU acceleration for smooth animations */
        .transform,
        .animate-spin,
        .animate-pulse,
        .animate-bounce {
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
        }
        
        /* Optimize images and videos */
        img,
        video {
          max-width: 100%;
          height: auto;
          display: block;
        }
        
        /* Smooth scrolling with momentum on iOS */
        .scroll-smooth {
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }
        
        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .bg-myth-background {
            background: #000000 !important;
          }
          
          .text-myth-textPrimary {
            color: #ffffff !important;
          }
          
          .border-myth-accent {
            border-color: #00D4FF !important;
          }
        }
        
        /* Dark mode optimizations */
        @media (prefers-color-scheme: dark) {
          :root {
            color-scheme: dark;
          }
        }
        
        /* Print styles */
        @media print {
          .no-print {
            display: none !important;
          }
          
          * {
            background: transparent !important;
            color: black !important;
            box-shadow: none !important;
            text-shadow: none !important;
          }
        }
        
        /* Focus management for accessibility */
        .focus\\:outline-none:focus {
          outline: 2px solid #00D4FF;
          outline-offset: 2px;
        }
        
        /* Loading states */
        .loading {
          pointer-events: none;
          opacity: 0.7;
        }
        
        .loading::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 20px;
          height: 20px;
          margin: -10px 0 0 -10px;
          border: 2px solid #00D4FF;
          border-radius: 50%;
          border-top-color: transparent;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #00D4FF, #10B981);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #00B4DF, #0D9668);
        }
        
        /* Selection styling */
        ::selection {
          background: rgba(0, 212, 255, 0.3);
          color: inherit;
        }
        
        ::-moz-selection {
          background: rgba(0, 212, 255, 0.3);
          color: inherit;
        }
        
        /* Optimize font loading */
        @font-display: swap;
        
        /* Critical CSS inlined for performance */
        .hero-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .cta-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 1rem 2rem;
          border-radius: 0.5rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          border: none;
          background: linear-gradient(45deg, #00D4FF, #10B981);
          color: #000;
        }
        
        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        
        .cta-button:active {
          transform: translateY(0);
        }
        
        /* Responsive utilities */
        @media (max-width: 640px) {
          .text-responsive {
            font-size: clamp(1rem, 4vw, 1.5rem);
          }
          
          .hero-section {
            padding: 2rem 1rem;
          }
        }
        
        /* Performance monitoring styles */
        .perf-monitor {
          position: fixed;
          top: 10px;
          left: 10px;
          background: rgba(0, 0, 0, 0.8);
          color: #00D4FF;
          padding: 0.5rem;
          border-radius: 4px;
          font-size: 12px;
          font-family: monospace;
          z-index: 9999;
          pointer-events: none;
        }
        
        /* Accessibility improvements */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        
        /* Skip link for keyboard navigation */
        .skip-link {
          position: absolute;
          top: -40px;
          left: 6px;
          background: #00D4FF;
          color: #000;
          padding: 8px;
          text-decoration: none;
          border-radius: 4px;
          z-index: 10000;
        }
        
        .skip-link:focus {
          top: 6px;
        }
      `}</style>
    </ErrorBoundary>
  );
};

export default UltimateApp;
