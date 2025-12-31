import { useState, useMemo } from "react";
import { Header } from "@/components/dashboard/Header";
import { StatCard } from "@/components/ui/stat-card";
import { MiniMap } from "@/components/dashboard/MiniMap";
import { SLAAlertStrip } from "@/components/dashboard/SLAAlertStrip";
import { CaseRow } from "@/components/dashboard/CaseRow";
import { CaseDetailPanel } from "@/components/dashboard/CaseDetailPanel";
import { CaseFilters } from "@/components/dashboard/CaseFilters";
import { mockCases } from "@/data/mock-cases";
import { Case, Severity } from "@/types/case";
import { FileText, AlertTriangle, Clock, CheckCircle, Bell } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAvailability } from "@/contexts/AvailabilityContext";

export default function Dashboard() {
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeverities, setSelectedSeverities] = useState<Severity[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAvailable } = useAvailability();

  // Test function to trigger new assignment alert (for development)
  const triggerTestAlert = () => {
    if (typeof window !== "undefined" && (window as any).__triggerNewAssignment) {
      (window as any).__triggerNewAssignment();
      toast({
        title: "Test Alert Triggered",
        description: isAvailable 
          ? "You are online - no popup will show"
          : "Check for popup, sound, and browser notification",
      });
    }
  };

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

  // Filter cases based on search and filters
  const filteredCases = useMemo(() => {
    return mockCases.filter((caseData) => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        if (
          !caseData.id.toLowerCase().includes(query) &&
          !caseData.location.toLowerCase().includes(query)
        ) {
          return false;
        }
      }
      // Severity filter
      if (selectedSeverities.length > 0 && !selectedSeverities.includes(caseData.severity)) {
        return false;
      }
      // Status filter
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(caseData.status)) {
        return false;
      }
      return true;
    });
  }, [searchQuery, selectedSeverities, selectedStatuses]);

  const handleAcknowledge = (caseData: Case) => {
    toast({
      title: "Case Acknowledged",
      description: `Case ${caseData.id} has been acknowledged. Webhook triggered.`,
    });
  };

  const handleViewFullMap = () => {
    navigate("/fullscreen-map");
  };

  const recentCases = filteredCases.slice(0, 5);

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Dashboard"
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          onFilterClick={() => setShowFilters(!showFilters)}
        />

        {showFilters && (
          <div className="px-6 py-3 border-b border-border bg-card">
            <CaseFilters
              selectedSeverities={selectedSeverities}
              onSeverityChange={setSelectedSeverities}
              selectedStatuses={selectedStatuses}
              onStatusChange={setSelectedStatuses}
            />
          </div>
        )}

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
                cases={filteredCases}
                onCaseClick={setSelectedCase}
                onViewFullMap={handleViewFullMap}
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
                <h2 className="text-lg font-semibold">
                  {searchQuery || selectedSeverities.length > 0 || selectedStatuses.length > 0
                    ? `Filtered Cases (${filteredCases.length})`
                    : "Recent Cases"}
                </h2>
                <div className="flex items-center gap-2">
                  {/* Dev test button - remove in production */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={triggerTestAlert}
                    className="text-xs"
                  >
                    <Bell className="w-3 h-3 mr-1" />
                    Test Alert
                  </Button>
                  <a
                    href="/cases"
                    className="text-sm text-primary hover:underline"
                  >
                    View all cases →
                  </a>
                </div>
              </div>
              <div className="space-y-3">
                {recentCases.length > 0 ? (
                  recentCases.map((caseData) => (
                    <CaseRow
                      key={caseData.id}
                      caseData={caseData}
                      isSelected={selectedCase?.id === caseData.id}
                      onSelect={setSelectedCase}
                      onAcknowledge={handleAcknowledge}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No cases found matching your search</p>
                  </div>
                )}
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
