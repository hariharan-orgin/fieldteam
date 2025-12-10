import { useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { StatCard } from "@/components/ui/stat-card";
import { MiniMap } from "@/components/dashboard/MiniMap";
import { SLAAlertStrip } from "@/components/dashboard/SLAAlertStrip";
import { CaseRow } from "@/components/dashboard/CaseRow";
import { CaseDetailPanel } from "@/components/dashboard/CaseDetailPanel";
import { mockCases } from "@/data/mock-cases";
import { Case } from "@/types/case";
import { FileText, AlertTriangle, Clock, CheckCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const { toast } = useToast();

  const stats = {
    total: mockCases.length,
    urgent: mockCases.filter((c) => c.severity === "critical" || c.severity === "high").length,
    overdue: mockCases.filter((c) => c.slaMinutesRemaining <= 0).length,
    closed: mockCases.filter((c) => c.status === "resolved").length,
  };

  const slaStats = {
    overdue: mockCases.filter((c) => c.slaMinutesRemaining <= 0).length,
    dueSoon: mockCases.filter((c) => c.slaMinutesRemaining > 0 && c.slaMinutesRemaining <= 15).length,
    normal: mockCases.filter((c) => c.slaMinutesRemaining > 15).length,
  };

  const handleAcknowledge = (caseData: Case) => {
    toast({
      title: "Case Acknowledged",
      description: `Case ${caseData.id} has been acknowledged. Webhook triggered.`,
    });
  };

  const recentCases = mockCases.slice(0, 3);

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Dashboard" />
        
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-4">
              <StatCard
                title="Total Assigned"
                value={stats.total}
                icon={FileText}
                trend="up"
                trendValue="12%"
              />
              <StatCard
                title="Urgent"
                value={stats.urgent}
                icon={AlertTriangle}
                variant="warning"
                trend="down"
                trendValue="5%"
              />
              <StatCard
                title="Overdue"
                value={stats.overdue}
                icon={Clock}
                variant="critical"
                trend="neutral"
                trendValue="0%"
              />
              <StatCard
                title="Closed Today"
                value={stats.closed}
                icon={CheckCircle}
                variant="success"
                trend="up"
                trendValue="8%"
              />
            </div>

            {/* Map and SLA Strip */}
            <div className="grid grid-cols-1 gap-4">
              <MiniMap
                cases={mockCases}
                onCaseClick={setSelectedCase}
              />
              <SLAAlertStrip
                overdue={slaStats.overdue}
                dueSoon={slaStats.dueSoon}
                normal={slaStats.normal}
              />
            </div>

            {/* Recent Cases Preview */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Recent Cases</h2>
                <a
                  href="/cases"
                  className="text-sm text-primary hover:underline"
                >
                  View all cases →
                </a>
              </div>
              <div className="space-y-3">
                {recentCases.map((caseData) => (
                  <CaseRow
                    key={caseData.id}
                    caseData={caseData}
                    isSelected={selectedCase?.id === caseData.id}
                    onSelect={setSelectedCase}
                    onAcknowledge={handleAcknowledge}
                  />
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Detail Panel */}
      {selectedCase && (
        <CaseDetailPanel
          caseData={selectedCase}
          onClose={() => setSelectedCase(null)}
        />
      )}
    </div>
  );
}
