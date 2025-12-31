import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { NotificationPopup } from "@/components/NotificationPopup";
import { mockCases } from "@/data/mock-cases";
import { cn } from "@/lib/utils";
import { useAvailability } from "@/contexts/AvailabilityContext";
import { useAssignmentListener } from "@/hooks/useAssignmentListener";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isAvailable, goOnline } = useAvailability();

  const {
    newAssignment,
    showPopup,
    dismissPopup,
    hasNewAssignments,
  } = useAssignmentListener({
    isAvailable,
    onNewAssignment: (caseData) => {
      console.log("New assignment received:", caseData.id);
    },
  });

  const assignedCasesCount = mockCases.filter(
    (c) => c.status !== "resolved"
  ).length;

  const handleGoOnline = () => {
    goOnline();
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar
        collapsed={sidebarCollapsed}
        onCollapse={setSidebarCollapsed}
        assignedCasesCount={assignedCasesCount}
        highlightCases={hasNewAssignments && !isAvailable}
      />
      {/* Main content with margin to account for fixed sidebar */}
      <main
        className={cn(
          "flex-1 flex flex-col overflow-hidden transition-all duration-300",
          sidebarCollapsed ? "ml-16" : "ml-[260px]"
        )}
      >
        {children}
      </main>

      {/* Offline Assignment Notification Popup */}
      <NotificationPopup
        open={showPopup}
        onDismiss={dismissPopup}
        onGoOnline={handleGoOnline}
        caseData={newAssignment}
      />
    </div>
  );
}
