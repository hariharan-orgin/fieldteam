import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { mockCases } from "@/data/mock-cases";
import { Case, Severity } from "@/types/case";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MapPin, X, Navigation, ChevronRight, ArrowLeft, Crosshair } from "lucide-react";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export default function FullscreenMap() {
  const navigate = useNavigate();
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [filters, setFilters] = useState<Severity[]>(["critical", "high", "medium", "low"]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const getUserLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLocating(false);
        },
        { enableHighAccuracy: true }
      );
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

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
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">Live Map</h1>
        </div>
        <div className="flex items-center gap-2">
          {userLocation && (
            <span className="text-xs text-muted-foreground">
              {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={getUserLocation}
            disabled={isLocating}
            className="rounded-button"
          >
            <Crosshair className={cn("w-4 h-4 mr-1.5", isLocating && "animate-spin")} />
            {isLocating ? "Locating..." : "My Location"}
          </Button>
        </div>
      </div>

      {/* Map Container */}
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

        {/* Full Map Placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary to-muted">
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
                linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
          />

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
                  className={cn("w-10 h-10 drop-shadow-lg", severityColors[caseData.severity])}
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
              <div className="w-6 h-6 rounded-full bg-primary border-3 border-card shadow-lg" />
              <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium bg-card px-2 py-0.5 rounded shadow-sm whitespace-nowrap">
                You
              </span>
            </div>
          </div>
        </div>

        {/* Quick Card on Pin Click */}
        {selectedCase && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 bg-card rounded-lg shadow-elevated p-5 w-96 animate-fade-in">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-lg">{selectedCase.id}</span>
                <SeverityBadge severity={selectedCase.severity} />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setSelectedCase(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
              <MapPin className="w-4 h-4" />
              <span>{selectedCase.location}</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1 rounded-button">
                <Navigation className="w-4 h-4 mr-1.5" />
                Navigate
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 rounded-button"
                onClick={() => navigate("/cases")}
              >
                Open Details
                <ChevronRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        )}

        {/* Map Legend */}
        <div className="absolute bottom-4 right-4 z-20 bg-card/95 backdrop-blur-sm rounded-lg p-4 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground mb-3">Legend</p>
          <div className="flex flex-col gap-2 text-sm">
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
            <div className="flex items-center gap-2 pt-2 border-t border-border mt-1">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span>Your Location</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
