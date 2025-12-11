import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { LoginPage } from "@/components/auth/LoginPage";
import Index from "./pages/Index";
import AssignedCases from "./pages/AssignedCases";
import MapView from "./pages/MapView";
import SLAAlerts from "./pages/SLAAlerts";
import ActivityLog from "./pages/ActivityLog";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import FullscreenMap from "./pages/FullscreenMap";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const handleLogin = (email: string, password: string) => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
  };

  // Store logout handler for use in other components
  useEffect(() => {
    (window as any).handleLogout = handleLogout;
  }, []);

  if (!isLoggedIn) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <LoginPage onLogin={handleLogin} />
        </TooltipProvider>
      </QueryClientProvider>
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
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route
              path="/cases"
              element={
                <DashboardLayout>
                  <AssignedCases />
                </DashboardLayout>
              }
            />
            <Route
              path="/map"
              element={
                <DashboardLayout>
                  <MapView />
                </DashboardLayout>
              }
            />
            <Route
              path="/alerts"
              element={
                <DashboardLayout>
                  <SLAAlerts />
                </DashboardLayout>
              }
            />
            <Route
              path="/activity"
              element={
                <DashboardLayout>
                  <ActivityLog />
                </DashboardLayout>
              }
            />
            <Route
              path="/settings"
              element={
                <DashboardLayout>
                  <Settings />
                </DashboardLayout>
              }
            />
            <Route
              path="/profile"
              element={
                <DashboardLayout>
                  <Profile />
                </DashboardLayout>
              }
            />
            <Route path="/fullscreen-map" element={<FullscreenMap />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
