import { Case } from "@/types/case";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { SLAProgress } from "@/components/ui/sla-progress";
import { Button } from "@/components/ui/button";
import { ChevronRight, Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface CaseRowProps {
  caseData: Case;
  isSelected?: boolean;
  onSelect?: (caseData: Case) => void;
  onAcknowledge?: (caseData: Case) => void;
}

const statusLabels: Record<string, string> = {
  pending: "Pending",
  acknowledged: "Acknowledged",
  on_route: "On Route",
  arrived: "Arrived",
  in_progress: "In Progress",
  resolved: "Resolved",
};

export function CaseRow({
  caseData,
  isSelected,
  onSelect,
  onAcknowledge,
}: CaseRowProps) {
  return (
    <div
      className={cn(
        "bg-card rounded-lg border p-4 shadow-card transition-all cursor-pointer hover:shadow-elevated hover:border-primary/30",
        isSelected && "ring-2 ring-primary border-primary"
      )}
      onClick={() => onSelect?.(caseData)}
    >
      <div className="flex items-start gap-4">
        {/* Case ID and Severity */}
        <div className="flex-shrink-0">
          <p className="font-semibold text-sm">{caseData.id}</p>
          <SeverityBadge
            severity={caseData.severity}
            pulse={caseData.severity === "critical" && caseData.status === "pending"}
            className="mt-1"
          />
        </div>

        {/* Location and Time */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-sm">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
            <span className="truncate">{caseData.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
            <Clock className="w-3 h-3 flex-shrink-0" />
            <span>Received {caseData.timeReceived}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Assigned by: {caseData.assignedBy}
          </p>
        </div>

        {/* SLA Timer */}
        <div className="flex-shrink-0">
          <SLAProgress
            remainingMinutes={caseData.slaMinutesRemaining}
            totalMinutes={caseData.slaTotalMinutes}
            size="sm"
          />
        </div>

        {/* Status and Actions */}
        <div className="flex flex-col items-end gap-2">
          <span
            className={cn(
              "text-xs px-2 py-1 rounded-full",
              caseData.status === "pending"
                ? "bg-secondary text-secondary-foreground"
                : caseData.status === "resolved"
                ? "bg-low/10 text-low"
                : "bg-primary/10 text-primary"
            )}
          >
            {statusLabels[caseData.status]}
          </span>
          <div className="flex items-center gap-2">
            {caseData.status === "pending" && (
              <Button
                size="sm"
                className="h-7 text-xs rounded-button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAcknowledge?.(caseData);
                }}
              >
                Acknowledge
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(e) => {
                e.stopPropagation();
                onSelect?.(caseData);
              }}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
