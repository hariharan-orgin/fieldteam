import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter, ChevronDown } from "lucide-react";
import { Severity } from "@/types/case";

interface CaseFiltersProps {
  selectedSeverities: Severity[];
  onSeverityChange: (severities: Severity[]) => void;
  selectedStatuses: string[];
  onStatusChange: (statuses: string[]) => void;
}

const severities: Severity[] = ["critical", "high", "medium", "low"];
const statuses = ["pending", "acknowledged", "on_route", "arrived", "in_progress", "resolved"];

export function CaseFilters({
  selectedSeverities,
  onSeverityChange,
  selectedStatuses,
  onStatusChange,
}: CaseFiltersProps) {
  const toggleSeverity = (severity: Severity) => {
    if (selectedSeverities.includes(severity)) {
      onSeverityChange(selectedSeverities.filter((s) => s !== severity));
    } else {
      onSeverityChange([...selectedSeverities, severity]);
    }
  };

  const toggleStatus = (status: string) => {
    if (selectedStatuses.includes(status)) {
      onStatusChange(selectedStatuses.filter((s) => s !== status));
    } else {
      onStatusChange([...selectedStatuses, status]);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 rounded-button">
            <Filter className="w-3.5 h-3.5 mr-1.5" />
            Severity
            <ChevronDown className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-40">
          <DropdownMenuLabel className="text-xs">Filter by Severity</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {severities.map((severity) => (
            <DropdownMenuCheckboxItem
              key={severity}
              checked={selectedSeverities.includes(severity)}
              onCheckedChange={() => toggleSeverity(severity)}
              className="capitalize"
            >
              {severity}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 rounded-button">
            Status
            <ChevronDown className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-40">
          <DropdownMenuLabel className="text-xs">Filter by Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {statuses.map((status) => (
            <DropdownMenuCheckboxItem
              key={status}
              checked={selectedStatuses.includes(status)}
              onCheckedChange={() => toggleStatus(status)}
              className="capitalize"
            >
              {status.replace("_", " ")}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {(selectedSeverities.length > 0 || selectedStatuses.length > 0) && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs"
          onClick={() => {
            onSeverityChange([]);
            onStatusChange([]);
          }}
        >
          Clear filters
        </Button>
      )}
    </div>
  );
}
