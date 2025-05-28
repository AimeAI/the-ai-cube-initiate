import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Snake3Game from "./routes/Snake3Game.tsx";
import CrystalResonance from "./routes/CrystalResonance.tsx";
import VisionSystem from "./routes/VisionSystem.tsx";
import EthicsFramework from "./routes/EthicsFramework.tsx";
import ClassifierConstruct from "./routes/ClassifierConstruct.tsx";
import GenerativeCore from "./routes/GenerativeCore.tsx";
import DecisionTreeGame from "./routes/DecisionTreeGame.tsx";
import NeuralNetworkChamber from "./routes/NeuralNetworkChamber.tsx";
import StudentDashboard from "./pages/StudentDashboard";
import FoundersChambersModule1 from "./modules/founders-chamber/FoundersChambersModule1";
import NeuralForge from "./routes/NeuralForge";
import NeuralPathways from "./routes/NeuralPathways";
import PredictorEngineGame from "./routes/PredictorEngineGame";
import QuantumChamberGame from "./routes/QuantumChamberGame";
import ReinforcementLab from "./routes/ReinforcementLab";
import TrajectoryGame from "./routes/TrajectoryGame"; // Added import
import PaymentPage from "./pages/PaymentPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    {/* <TooltipProvider> */}
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="/snake3" element={<Snake3Game />} />
          <Route path="/crystal-resonance" element={<CrystalResonance />} />
          <Route path="/classifier-construct" element={<ClassifierConstruct />} />
          <Route path="/ethics-framework" element={<EthicsFramework />} />
          <Route path="/generative-core" element={<GenerativeCore />} />
          <Route path="/decision-tree-game" element={<DecisionTreeGame />} />
          <Route path="/neural-network-chamber" element={<NeuralNetworkChamber />} />
<Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/vision-system" element={<VisionSystem />} />
          <Route path="/founders-chamber-module-1" element={<FoundersChambersModule1 />} />
          <Route path="/neural-forge" element={<NeuralForge />} />
          <Route path="/neural-pathways" element={<NeuralPathways />} />
          <Route path="/predictor-engine" element={<PredictorEngineGame />} />
          <Route path="/quantum-chamber" element={<QuantumChamberGame />} />
          <Route path="/reinforcement-lab" element={<ReinforcementLab />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/trajectory-game" element={<TrajectoryGame />} /> {/* Added route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    {/* </TooltipProvider> */}
  </QueryClientProvider>
);

export default App;
