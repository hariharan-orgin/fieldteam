import { useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { mockCases } from "@/data/mock-cases";
import { Case, Severity } from "@/types/case";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MapPin, X, Navigation, ChevronRight } from "lucide-react";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { cn } from "@/lib/utils";
import indiaMapBg from "@/assets/india-map-bg.jpg";

export default function MapView() {
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [filters, setFilters] = useState<Severity[]>(["critical", "high", "medium", "low"]);

  const toggleFilter = (severity: Severity) => {
    if (filters.includes(severity)) {
      setFilters(filters.filter((f) => f !== severity));
    } else {
      setFilters([...filters, severity]);
    }
  };

  const filteredCases = mockCases.filter((c) => filters.includes(c.severity));

  const severityColors = {
    critical: "text-critical",
    high: "text-high",
    medium: "text-medium",
    low: "text-low",
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header title="Map View" showSearch={false} />

      <div className="flex-1 relative">
        {/* Filter Controls */}
        <div className="absolute top-4 left-4 z-20 bg-card rounded-lg shadow-elevated p-3 space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Filter by Severity
          </p>
          {(["critical", "high", "medium", "low"] as Severity[]).map((severity) => (
            <div key={severity} className="flex items-center gap-2">
              <Checkbox
                id={`filter-${severity}`}
                checked={filters.includes(severity)}
                onCheckedChange={() => toggleFilter(severity)}
              />
              <Label
                htmlFor={`filter-${severity}`}
                className="text-sm capitalize cursor-pointer"
              >
                {severity}
              </Label>
            </div>
          ))}
        </div>

        {/* Full Map with India Background */}
        <div className="absolute inset-0">
          <img 
            src={indiaMapBg} 
            alt="India Map"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />

          {/* Map pins */}
          {filteredCases.map((caseData, index) => {
            const positions = [
              { top: "20%", left: "25%" },
              { top: "35%", left: "55%" },
              { top: "55%", left: "20%" },
              { top: "30%", left: "70%" },
              { top: "65%", left: "50%" },
            ];
            const pos = positions[index % positions.length];

            return (
              <button
                key={caseData.id}
                className={cn(
                  "absolute transform -translate-x-1/2 -translate-y-full cursor-pointer transition-all hover:scale-125 z-10",
                  selectedCase?.id === caseData.id && "scale-125"
                )}
                style={{ top: pos.top, left: pos.left }}
                onClick={() => setSelectedCase(caseData)}
              >
                <MapPin
                  className={cn("w-8 h-8 drop-shadow-lg", severityColors[caseData.severity])}
                  fill="currentColor"
                />
              </button>
            );
          })}

          {/* User location */}
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
            style={{ top: "45%", left: "40%" }}
          >
            <div className="relative">
              <div className="w-5 h-5 rounded-full bg-primary border-2 border-card shadow-lg" />
              <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
            </div>
          </div>
        </div>

        {/* Quick Card on Pin Click */}
        {selectedCase && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 bg-card rounded-lg shadow-elevated p-4 w-80 animate-fade-in">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{selectedCase.id}</span>
                <SeverityBadge severity={selectedCase.severity} />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setSelectedCase(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
              <MapPin className="w-3.5 h-3.5" />
              <span>{selectedCase.location}</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1 rounded-button">
                <Navigation className="w-3.5 h-3.5 mr-1.5" />
                Navigate
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 rounded-button"
                onClick={() => (window.location.href = "/cases")}
              >
                Open Details
                <ChevronRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          </div>
        )}

        {/* Map Legend */}
        <div className="absolute bottom-4 right-4 z-20 bg-card/95 backdrop-blur-sm rounded-lg p-3 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground mb-2">Legend</p>
          <div className="flex flex-col gap-1.5 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-critical" />
              <span>Critical</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-high" />
              <span>High</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-medium" />
              <span>Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-low" />
              <span>Low</span>
            </div>
            <div className="flex items-center gap-2 pt-1 border-t border-border mt-1">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span>Your Location</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
