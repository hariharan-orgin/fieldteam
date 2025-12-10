export type Severity = "critical" | "high" | "medium" | "low";

export type CaseStatus = 
  | "pending" 
  | "acknowledged" 
  | "on_route" 
  | "arrived" 
  | "in_progress" 
  | "resolved";

export interface CaseAttachment {
  id: string;
  type: "image" | "video" | "document";
  url: string;
  thumbnail?: string;
  name: string;
}

export interface CaseMessage {
  id: string;
  sender: "reporter" | "responder";
  content: string;
  timestamp: string;
}

export interface AuditEvent {
  id: string;
  action: string;
  actor: {
    name: string;
    initials: string;
  };
  timestamp: string;
  details?: string;
}

export interface Case {
  id: string;
  severity: Severity;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  timeReceived: string;
  slaMinutesRemaining: number;
  slaTotalMinutes: number;
  slaDeadline: string;
  status: CaseStatus;
  assignedBy: string;
  reporter?: {
    name: string;
    phone: string;
  };
  messages: CaseMessage[];
  attachments: CaseAttachment[];
  auditTrail: AuditEvent[];
  notes?: string;
}
