import { Header } from "@/components/dashboard/Header";
import { mockCases } from "@/data/mock-cases";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { SLAProgress } from "@/components/ui/sla-progress";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, Clock, AlertTriangle, Phone, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function SLAAlerts() {
  const { toast } = useToast();

  // Filter and sort by SLA urgency
  const urgentCases = mockCases
    .filter((c) => c.slaMinutesRemaining <= 30 && c.status !== "resolved")
    .sort((a, b) => a.slaMinutesRemaining - b.slaMinutesRemaining);

  const handleAssign = (caseId: string) => {
    toast({
      title: "Case Assigned",
      description: `You have been assigned to case ${caseId}.`,
    });
  };

  const handleContact = (caseId: string) => {
    toast({
      title: "Contact Initiated",
      description: `Initiating contact for case ${caseId}.`,
    });
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header title="SLA Alerts" />

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-4">
          {urgentCases.length > 0 ? (
            urgentCases.map((caseData) => {
              const isOverdue = caseData.slaMinutesRemaining <= 0;
              const isCriticalTime = caseData.slaMinutesRemaining <= 10;

              return (
                <div
                  key={caseData.id}
                  className={cn(
                    "bg-card rounded-lg border-2 shadow-card p-5 transition-all",
                    isOverdue
                      ? "border-critical bg-critical/5"
                      : isCriticalTime
                      ? "border-high bg-high/5"
                      : "border-border"
                  )}
                >
                  <div className="flex items-start gap-4">
                    {/* Alert Icon */}
                    <div
                      className={cn(
                        "flex-shrink-0 p-3 rounded-lg",
                        isOverdue ? "bg-critical/20" : "bg-high/20"
                      )}
                    >
                      <AlertTriangle
                        className={cn(
                          "w-6 h-6",
                          isOverdue ? "text-critical" : "text-high"
                        )}
                      />
                    </div>

                    {/* Case Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-lg">{caseData.id}</span>
                        <SeverityBadge severity={caseData.severity} size="lg" />
                        {isOverdue && (
                          <span className="text-xs font-semibold text-critical uppercase tracking-wide animate-pulse">
                            OVERDUE
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-sm mb-1">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{caseData.location}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                        <Clock className="w-4 h-4" />
                        <span>
                          Received {caseData.timeReceived} • Deadline: {caseData.slaDeadline}
                        </span>
                      </div>

                      {isOverdue && (
                        <div className="bg-critical/10 border border-critical/20 rounded-md p-2 mb-3">
                          <p className="text-sm text-critical font-medium">
                            SLA Breached — This case requires immediate attention
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="rounded-button"
                          onClick={() => handleAssign(caseData.id)}
                        >
                          <Navigation className="w-4 h-4 mr-1.5" />
                          Assign to Me
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-button"
                          onClick={() => handleContact(caseData.id)}
                        >
                          <Phone className="w-4 h-4 mr-1.5" />
                          Contact
                        </Button>
                      </div>
                    </div>

                    {/* SLA Timer */}
                    <div className="flex-shrink-0">
                      <SLAProgress
                        remainingMinutes={caseData.slaMinutesRemaining}
                        totalMinutes={caseData.slaTotalMinutes}
                        deadline={caseData.slaDeadline}
                        size="default"
                      />
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <AlertTriangle className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">No SLA Alerts</p>
              <p className="text-sm">All cases are within acceptable SLA limits</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
