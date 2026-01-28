import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DhanvantariChat from "./components/DhanvantariChat";
import VisualDiagnosis from "./components/VisualDiagnosis";
import WellnessPortal from "./components/WellnessPortal";
import WomensWellness from "./components/WomensWellness";
import HerbGarden from "./components/HerbGarden";
import MedicineScanner from "./components/MedicineScanner";

const queryClient = new QueryClient();

const App = () => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("App component mounted");
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Application</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/chat" element={<DhanvantariChat />} />
            <Route path="/converter" element={<MedicineScanner />} />
            <Route path="/diagnosis" element={<VisualDiagnosis />} />
            <Route path="/wellness" element={<WellnessPortal />} />
            <Route path="/women" element={<WomensWellness />} />
            <Route path="/herbs" element={<HerbGarden />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
