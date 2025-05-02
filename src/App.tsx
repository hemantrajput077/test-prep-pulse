
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import AuthGuard from "@/components/AuthGuard";

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Tests from "./pages/Tests";
import Practice from "./pages/Practice";
import TestSession from "./pages/TestSession";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            } />
            <Route path="/tests" element={
              <AuthGuard>
                <Tests />
              </AuthGuard>
            } />
            <Route path="/practice" element={
              <AuthGuard>
                <Practice />
              </AuthGuard>
            } />
            <Route path="/test-session/:testId" element={
              <AuthGuard>
                <TestSession />
              </AuthGuard>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
