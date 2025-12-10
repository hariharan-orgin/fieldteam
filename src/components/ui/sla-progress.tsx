import { cn } from "@/lib/utils";

interface SLAProgressProps {
  remainingMinutes: number;
  totalMinutes: number;
  deadline?: string;
  className?: string;
  size?: "sm" | "default" | "lg";
}

export function SLAProgress({
  remainingMinutes,
  totalMinutes,
  deadline,
  className,
  size = "default",
}: SLAProgressProps) {
  const percentage = Math.max(0, Math.min(100, (remainingMinutes / totalMinutes) * 100));
  
  const getStatus = () => {
    if (remainingMinutes <= 0) return "overdue";
    if (percentage <= 25) return "critical";
    if (percentage <= 50) return "warning";
    return "normal";
  };

  const status = getStatus();

  const statusColors = {
    overdue: "text-critical",
    critical: "text-critical",
    warning: "text-high",
    normal: "text-low",
  };

  const strokeColors = {
    overdue: "stroke-critical",
    critical: "stroke-critical",
    warning: "stroke-high",
    normal: "stroke-low",
  };

  const sizes = {
    sm: { size: 48, stroke: 4 },
    default: { size: 80, stroke: 6 },
    lg: { size: 120, stroke: 8 },
  };

  const { size: circleSize, stroke } = sizes[size];
  const radius = (circleSize - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const formatTime = (minutes: number) => {
    if (minutes <= 0) return "Overdue";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative" style={{ width: circleSize, height: circleSize }}>
        {/* Background circle */}
        <svg
          className="transform -rotate-90"
          width={circleSize}
          height={circleSize}
        >
          <circle
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            stroke="hsl(var(--border))"
            strokeWidth={stroke}
            fill="none"
          />
          <circle
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            className={cn(strokeColors[status], "transition-all duration-500")}
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-semibold", statusColors[status], size === "sm" ? "text-xs" : size === "lg" ? "text-lg" : "text-sm")}>
            {formatTime(remainingMinutes)}
          </span>
          {size !== "sm" && (
            <span className="text-[10px] text-muted-foreground">remaining</span>
          )}
        </div>
      </div>
      {deadline && size !== "sm" && (
        <p className="text-xs text-muted-foreground">
          Deadline: {deadline}
        </p>
      )}
    </div>
  );
}
