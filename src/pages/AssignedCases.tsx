import { useState, useMemo } from "react";
import { Header } from "@/components/dashboard/Header";
import { CaseRow } from "@/components/dashboard/CaseRow";
import { CaseDetailPanel } from "@/components/dashboard/CaseDetailPanel";
import { CaseFilters } from "@/components/dashboard/CaseFilters";
import { mockCases } from "@/data/mock-cases";
import { Case, Severity } from "@/types/case";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { FileText } from "lucide-react";

export default function AssignedCases() {
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeverities, setSelectedSeverities] = useState<Severity[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(true);
  const { toast } = useToast();

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

  const handleStatusUpdate = (caseId: string, status: string) => {
    toast({
      title: "Status Updated",
      description: `Case ${caseId} status changed to ${status.replace("_", " ")}.`,
    });
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Assigned Cases"
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          onFilterClick={() => setShowFilters(!showFilters)}
        />

        {showFilters && (
          <div className="px-6 py-4 border-b border-border bg-card">
            <CaseFilters
              selectedSeverities={selectedSeverities}
              onSeverityChange={setSelectedSeverities}
              selectedStatuses={selectedStatuses}
              onStatusChange={setSelectedStatuses}
            />
          </div>
        )}

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-3">
            {filteredCases.length > 0 ? (
              filteredCases.map((caseData) => (
                <CaseRow
                  key={caseData.id}
                  caseData={caseData}
                  isSelected={selectedCase?.id === caseData.id}
                  onSelect={setSelectedCase}
                  onAcknowledge={handleAcknowledge}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <FileText className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-lg font-medium">No cases found</p>
                <p className="text-sm">
                  {searchQuery ? "Try a different search term" : "Check Map or refresh to see new cases"}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Detail Panel */}
      {selectedCase && (
        <CaseDetailPanel
          caseData={selectedCase}
          onClose={() => setSelectedCase(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
}
