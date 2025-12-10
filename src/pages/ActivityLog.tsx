import { useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { TimelineItem } from "@/components/ui/timeline-item";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Calendar, Paperclip, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityEntry {
  id: string;
  caseId: string;
  action: string;
  actor: {
    name: string;
    initials: string;
  };
  timestamp: string;
  date: string;
  hasAttachment?: boolean;
  details?: string;
}

const mockActivity: ActivityEntry[] = [
  {
    id: "1",
    caseId: "C-1234",
    action: "Case Created",
    actor: { name: "System", initials: "SY" },
    timestamp: "10:23 AM",
    date: "Today",
  },
  {
    id: "2",
    caseId: "C-1234",
    action: "Escalated to Field Team",
    actor: { name: "Sarah M.", initials: "SM" },
    timestamp: "10:24 AM",
    date: "Today",
    details: "Escalated due to critical severity",
  },
  {
    id: "3",
    caseId: "C-1235",
    action: "Case Acknowledged",
    actor: { name: "Officer Johnson", initials: "OJ" },
    timestamp: "10:18 AM",
    date: "Today",
  },
  {
    id: "4",
    caseId: "C-1235",
    action: "Attachment Added",
    actor: { name: "Officer Johnson", initials: "OJ" },
    timestamp: "10:20 AM",
    date: "Today",
    hasAttachment: true,
  },
  {
    id: "5",
    caseId: "C-1236",
    action: "Status Updated to On Route",
    actor: { name: "Team Bravo", initials: "TB" },
    timestamp: "09:55 AM",
    date: "Today",
  },
  {
    id: "6",
    caseId: "C-1237",
    action: "Case Resolved",
    actor: { name: "Officer Williams", initials: "OW" },
    timestamp: "Yesterday, 4:30 PM",
    date: "Yesterday",
    details: "Issue resolved, no further action needed",
  },
  {
    id: "7",
    caseId: "C-1230",
    action: "Case Created",
    actor: { name: "System", initials: "SY" },
    timestamp: "Yesterday, 2:15 PM",
    date: "Yesterday",
  },
  {
    id: "8",
    caseId: "C-1230",
    action: "SLA Warning Triggered",
    actor: { name: "System", initials: "SY" },
    timestamp: "Yesterday, 3:00 PM",
    date: "Yesterday",
    details: "Case approaching SLA deadline",
  },
];

export default function ActivityLog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

  const filteredActivity = mockActivity.filter((entry) => {
    if (searchQuery && !entry.caseId.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (dateFilter === "today" && entry.date !== "Today") {
      return false;
    }
    if (dateFilter === "yesterday" && entry.date !== "Yesterday") {
      return false;
    }
    return true;
  });

  const groupedActivity = filteredActivity.reduce((groups, entry) => {
    if (!groups[entry.date]) {
      groups[entry.date] = [];
    }
    groups[entry.date].push(entry);
    return groups;
  }, {} as Record<string, ActivityEntry[]>);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header title="Activity Log" showSearch={false} />

      {/* Filters */}
      <div className="px-6 py-4 border-b border-border bg-card flex items-center gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by Case ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <div className="flex gap-2">
          {[
            { value: "all", label: "All Time" },
            { value: "today", label: "Today" },
            { value: "yesterday", label: "Yesterday" },
          ].map((option) => (
            <Button
              key={option.value}
              variant={dateFilter === option.value ? "default" : "outline"}
              size="sm"
              className="h-9 rounded-button"
              onClick={() => setDateFilter(option.value)}
            >
              <Calendar className="w-3.5 h-3.5 mr-1.5" />
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {Object.keys(groupedActivity).length > 0 ? (
            Object.entries(groupedActivity).map(([date, entries]) => (
              <div key={date}>
                <h3 className="text-sm font-semibold text-muted-foreground mb-4">
                  {date}
                </h3>
                <div className="bg-card rounded-lg border shadow-card p-4">
                  {entries.map((entry, index) => (
                    <div
                      key={entry.id}
                      className={cn(
                        "flex items-start gap-4",
                        index < entries.length - 1 && "pb-4 mb-4 border-b border-border"
                      )}
                    >
                      <div className="flex-1">
                        <TimelineItem
                          title={entry.action}
                          description={entry.details}
                          timestamp={entry.timestamp}
                          actor={entry.actor}
                          isLast={true}
                          variant={
                            entry.action.includes("Resolved")
                              ? "success"
                              : entry.action.includes("Warning") || entry.action.includes("SLA")
                              ? "warning"
                              : "default"
                          }
                        />
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                          {entry.caseId}
                        </span>
                        {entry.hasAttachment && (
                          <Paperclip className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Activity className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">No activity found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
