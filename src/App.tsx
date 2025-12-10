import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/layouts/DashboardLayout";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
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

export default App;
