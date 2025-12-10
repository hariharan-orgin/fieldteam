import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Case } from "@/types/case";
import { cn } from "@/lib/utils";

interface MiniMapProps {
  cases: Case[];
  onCaseClick?: (caseData: Case) => void;
  className?: string;
}

export function MiniMap({ cases, onCaseClick, className }: MiniMapProps) {
  const severityColors = {
    critical: "bg-critical",
    high: "bg-high",
    medium: "bg-medium",
    low: "bg-low",
  };

  return (
    <div className={cn("bg-card rounded-lg border shadow-card overflow-hidden", className)}>
      <div className="flex items-center justify-between p-3 border-b border-border">
        <h3 className="text-sm font-medium">Active Incidents Map</h3>
        <Button variant="ghost" size="sm" className="h-7 text-xs">
          View Full Map
        </Button>
      </div>
      
      {/* Map Placeholder */}
      <div className="relative h-[220px] bg-gradient-to-br from-secondary to-muted">
        {/* Grid overlay for map effect */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
        
        {/* Simulated map pins */}
        {cases.slice(0, 5).map((caseData, index) => {
          const positions = [
            { top: '25%', left: '30%' },
            { top: '40%', left: '60%' },
            { top: '60%', left: '25%' },
            { top: '35%', left: '75%' },
            { top: '70%', left: '55%' },
          ];
          const pos = positions[index];
          
          return (
            <button
              key={caseData.id}
              className={cn(
                "absolute transform -translate-x-1/2 -translate-y-full cursor-pointer transition-transform hover:scale-110 z-10",
                caseData.severity === "critical" && "animate-pulse"
              )}
              style={{ top: pos.top, left: pos.left }}
              onClick={() => onCaseClick?.(caseData)}
              title={`${caseData.id} — ${caseData.severity} — ${caseData.location}`}
            >
              <div className="relative">
                <MapPin 
                  className={cn(
                    "w-6 h-6 drop-shadow-md",
                    caseData.severity === "critical" && "text-critical",
                    caseData.severity === "high" && "text-high",
                    caseData.severity === "medium" && "text-medium",
                    caseData.severity === "low" && "text-low",
                  )}
                  fill="currentColor"
                />
                <div 
                  className={cn(
                    "absolute -top-1 -right-1 w-3 h-3 rounded-full text-[8px] font-bold flex items-center justify-center text-white",
                    severityColors[caseData.severity]
                  )}
                >
                  {index + 1}
                </div>
              </div>
            </button>
          );
        })}

        {/* User location marker */}
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{ top: '50%', left: '45%' }}
        >
          <div className="relative">
            <div className="w-4 h-4 rounded-full bg-primary border-2 border-card shadow-lg" />
            <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
          </div>
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-2 right-2 bg-card/90 backdrop-blur-sm rounded-md p-2 shadow-sm">
          <div className="flex flex-col gap-1 text-[10px]">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-critical" />
              <span>Critical</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-high" />
              <span>High</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-medium" />
              <span>Medium</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-low" />
              <span>Low</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
