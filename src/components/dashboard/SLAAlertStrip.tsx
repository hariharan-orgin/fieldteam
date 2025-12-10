import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

interface SLAAlertStripProps {
  overdue: number;
  dueSoon: number;
  normal: number;
}

export function SLAAlertStrip({ overdue, dueSoon, normal }: SLAAlertStripProps) {
  const alerts = [
    {
      label: "Overdue",
      count: overdue,
      className: "bg-critical/10 text-critical border-critical/20",
      dotClass: "bg-critical",
    },
    {
      label: "Due Soon",
      count: dueSoon,
      className: "bg-high/10 text-high border-high/20",
      dotClass: "bg-high",
    },
    {
      label: "Normal",
      count: normal,
      className: "bg-low/10 text-low border-low/20",
      dotClass: "bg-low",
    },
  ];

  return (
    <div className="bg-card rounded-lg border shadow-card p-3">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium">SLA Status Overview</span>
      </div>
      <div className="flex gap-2">
        {alerts.map((alert) => (
          <div
            key={alert.label}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border",
              alert.className
            )}
          >
            <div className={cn("w-2 h-2 rounded-full", alert.dotClass)} />
            <span className="text-xs font-medium">{alert.label}</span>
            <span className="text-sm font-semibold">{alert.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
