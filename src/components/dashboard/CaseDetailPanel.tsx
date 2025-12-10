import { Case } from "@/types/case";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { SLAProgress } from "@/components/ui/sla-progress";
import { TimelineItem } from "@/components/ui/timeline-item";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  X,
  MapPin,
  Phone,
  User,
  Download,
  Image,
  Video,
  FileText,
  ExternalLink,
  Check,
  Navigation,
  Clock,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface CaseDetailPanelProps {
  caseData: Case | null;
  onClose: () => void;
  onStatusUpdate?: (caseId: string, status: string) => void;
}

export function CaseDetailPanel({
  caseData,
  onClose,
  onStatusUpdate,
}: CaseDetailPanelProps) {
  const [notes, setNotes] = useState(caseData?.notes || "");

  if (!caseData) return null;

  const statusActions = [
    { status: "on_route", label: "On Route", icon: Navigation },
    { status: "arrived", label: "Arrived", icon: MapPin },
    { status: "in_progress", label: "In Progress", icon: Clock },
    { status: "resolved", label: "Resolved", icon: CheckCircle },
  ];

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case "image":
        return Image;
      case "video":
        return Video;
      default:
        return FileText;
    }
  };

  return (
    <div className="w-[360px] bg-card border-l border-border flex flex-col h-full animate-slide-in-right">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <span className="font-semibold">{caseData.id}</span>
          <SeverityBadge severity={caseData.severity} />
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button size="sm" className="flex-1 rounded-button">
              <Check className="w-4 h-4 mr-1" />
              Acknowledge
            </Button>
            <Button size="sm" variant="outline" className="flex-1 rounded-button">
              <Navigation className="w-4 h-4 mr-1" />
              Mark Arrived
            </Button>
          </div>

          {/* Reporter Info */}
          {caseData.reporter && (
            <div className="bg-secondary/50 rounded-lg p-3 space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Reporter
              </p>
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>{caseData.reporter.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {caseData.reporter.phone}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>Reported at {caseData.timeReceived}</span>
              </div>
            </div>
          )}

          {/* Mini Map */}
          <div className="bg-secondary/50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Location
              </p>
              <Button variant="ghost" size="sm" className="h-6 text-xs">
                <ExternalLink className="w-3 h-3 mr-1" />
                Open in Map
              </Button>
            </div>
            <div className="flex items-start gap-2 text-sm mb-2">
              <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
              <span>{caseData.location}</span>
            </div>
            <div className="h-32 bg-muted rounded-md flex items-center justify-center">
              <MapPin className="w-8 h-8 text-muted-foreground/50" />
            </div>
          </div>

          {/* Messages */}
          {caseData.messages.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                Recent Messages
              </p>
              <div className="space-y-2">
                {caseData.messages.slice(-2).map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "rounded-lg p-2.5 text-sm",
                      msg.sender === "reporter"
                        ? "bg-primary/10 text-foreground"
                        : "bg-secondary text-foreground"
                    )}
                  >
                    <p>{msg.content}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {msg.timestamp}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attachments */}
          {caseData.attachments.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Attachments
                </p>
                <Button variant="ghost" size="sm" className="h-6 text-xs">
                  <Download className="w-3 h-3 mr-1" />
                  Download All
                </Button>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {caseData.attachments.map((attachment) => {
                  const Icon = getAttachmentIcon(attachment.type);
                  return (
                    <div
                      key={attachment.id}
                      className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-secondary cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      {attachment.thumbnail ? (
                        <img
                          src={attachment.thumbnail}
                          alt={attachment.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Icon className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SLA Panel */}
          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3 text-center">
              SLA Status
            </p>
            <SLAProgress
              remainingMinutes={caseData.slaMinutesRemaining}
              totalMinutes={caseData.slaTotalMinutes}
              deadline={caseData.slaDeadline}
              size="lg"
            />
          </div>

          {/* Status Actions */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Update Status
            </p>
            <div className="grid grid-cols-2 gap-2">
              {statusActions.map((action) => (
                <Button
                  key={action.status}
                  variant={caseData.status === action.status ? "default" : "outline"}
                  size="sm"
                  className="rounded-button"
                  onClick={() => onStatusUpdate?.(caseData.id, action.status)}
                >
                  <action.icon className="w-3.5 h-3.5 mr-1.5" />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Audit Trail */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Audit Trail
              </p>
              <Button variant="ghost" size="sm" className="h-6 text-xs">
                <Download className="w-3 h-3 mr-1" />
                Export
              </Button>
            </div>
            <div className="bg-secondary/30 rounded-lg p-3">
              {caseData.auditTrail.map((event, index) => (
                <TimelineItem
                  key={event.id}
                  title={event.action}
                  description={event.details}
                  timestamp={event.timestamp}
                  actor={event.actor}
                  isLast={index === caseData.auditTrail.length - 1}
                  variant={
                    event.action.includes("OVERDUE")
                      ? "critical"
                      : event.action.includes("Resolved")
                      ? "success"
                      : "default"
                  }
                />
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Field Notes
            </p>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add site observations..."
              className="min-h-20 text-sm resize-none"
            />
            <Button size="sm" className="mt-2 rounded-button">
              Save Notes
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
