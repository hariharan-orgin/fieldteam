import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { mockCases } from "@/data/mock-cases";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const assignedCasesCount = mockCases.filter(
    (c) => c.status !== "resolved"
  ).length;

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar
        collapsed={sidebarCollapsed}
        onCollapse={setSidebarCollapsed}
        assignedCasesCount={assignedCasesCount}
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
    </div>
  );
}
