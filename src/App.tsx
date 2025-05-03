
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GuestIdProvider } from "@/components/layout/GuestIdProvider";

import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Tests from "./pages/Tests";
import Practice from "./pages/Practice";
import TestSession from "./pages/TestSession";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <GuestIdProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tests" element={<Tests />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/test-session/:testId" element={<TestSession />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </GuestIdProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
