import React, { useEffect, useState } from 'react';
import * as Tone from 'tone';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import GamesHub from "./pages/GamesHub"; // Added import for GamesHub
import Snake3Game from "./routes/Snake3Game.tsx";
import CrystalResonance from "./routes/CrystalResonance.tsx";
import VisionSystem from "./routes/VisionSystem.tsx";
import EthicsFramework from "./routes/EthicsFramework.tsx";
import ClassifierConstruct from "./routes/ClassifierConstruct.tsx";
import GenerativeCore from "./routes/GenerativeCore.tsx";
import DecisionTreeGame from "./routes/DecisionTreeGame.tsx";
import NeuralNetworkChamber from "./routes/NeuralNetworkChamber.tsx";
import StudentDashboard from "./pages/StudentDashboard";
import ParentPortal from "./pages/ParentPortal"; // Updated import
import FoundersChambersModule1 from "./modules/founders-chamber/FoundersChambersModule1";
import NeuralForge from "./routes/NeuralForge";
import NeuralPathways from "./routes/NeuralPathways";
import PredictorEngineGame from "./routes/PredictorEngineGame";
import QuantumChamberGame from "./routes/QuantumChamberGame";
import ReinforcementLab from "./routes/ReinforcementLab";
import TrajectoryGame from "./routes/TrajectoryGame"; // Added import
import PaymentPage from "./pages/PaymentPage";
import ParentProfilePage from "./pages/ParentProfile"; // Added import
import LoginPage from "../pages/login"; // Added import for LoginPage
import MysticalBackground from "./components/sacred/MysticalBackground"; // Added import

import { Button } from "@/components/ui/button"; // Added import

const queryClient = new QueryClient();

const App = () => {
  return (
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
            <Routes>
              <Route path="/" element={<Index />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="/games" element={<GamesHub />} />
              <Route path="/games/snake-3" element={<Snake3Game />} />
              <Route path="/games/crystal-resonance" element={<CrystalResonance />} />
              <Route path="/games/classifier-construct" element={<ClassifierConstruct />} />
              <Route path="/ethics-framework" element={<EthicsFramework />} /> {/* Assuming this is not a game */}
              <Route path="/generative-core" element={<GenerativeCore />} /> {/* Assuming this is not a game */}
              <Route path="/games/decision-tree" element={<DecisionTreeGame />} />
              <Route path="/games/neural-network-chamber" element={<NeuralNetworkChamber />} />
              <Route path="/dashboard/student" element={<StudentDashboard />} />
              <Route path="/dashboard/parent" element={<ParentPortal />} />
              <Route path="/games/vision-system" element={<VisionSystem />} />
              <Route path="/founders-chamber-module-1" element={<FoundersChambersModule1 />} /> {/* Assuming this is not a game */}
              <Route path="/games/neural-forge" element={<NeuralForge />} />
              <Route path="/games/neural-pathways" element={<NeuralPathways />} />
              <Route path="/games/predictor-engine" element={<PredictorEngineGame />} />
              <Route path="/games/quantum-chamber" element={<QuantumChamberGame />} />
              <Route path="/games/reinforcement-lab" element={<ReinforcementLab />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/profile/parent" element={<ParentProfilePage />} />
              <Route path="/games/trajectory" element={<TrajectoryGame />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <footer>
            {/* Placeholder for global footer. */}
          </footer>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
