import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { mockCases } from "@/data/mock-cases";

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
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
