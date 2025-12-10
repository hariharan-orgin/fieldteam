import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TimelineItemProps {
  title: string;
  description?: string;
  timestamp: string;
  actor?: {
    name: string;
    initials: string;
  };
  isLast?: boolean;
  variant?: "default" | "success" | "warning" | "critical";
}

export function TimelineItem({
  title,
  description,
  timestamp,
  actor,
  isLast = false,
  variant = "default",
}: TimelineItemProps) {
  const dotColors = {
    default: "bg-primary",
    success: "bg-low",
    warning: "bg-high",
    critical: "bg-critical",
  };

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={cn("h-2.5 w-2.5 rounded-full mt-1.5", dotColors[variant])} />
        {!isLast && <div className="flex-1 w-px bg-border mt-1" />}
      </div>
      <div className={cn("pb-4", isLast && "pb-0")}>
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">{title}</p>
          {actor && (
            <Avatar className="h-5 w-5">
              <AvatarFallback className="text-[10px] bg-secondary">
                {actor.initials}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
        <p className="text-[10px] text-muted-foreground mt-1">{timestamp}</p>
      </div>
    </div>
  );
}
