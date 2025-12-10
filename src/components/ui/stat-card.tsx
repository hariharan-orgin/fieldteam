import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  variant?: "default" | "critical" | "warning" | "success";
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  variant = "default",
  className,
}: StatCardProps) {
  const variantStyles = {
    default: "border-border",
    critical: "border-l-4 border-l-critical border-t-0 border-r-0 border-b-0",
    warning: "border-l-4 border-l-high border-t-0 border-r-0 border-b-0",
    success: "border-l-4 border-l-low border-t-0 border-r-0 border-b-0",
  };

  return (
    <div
      className={cn(
        "bg-card rounded-lg border p-4 shadow-card transition-all hover:shadow-elevated",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
        </div>
        {Icon && (
          <div className="rounded-lg bg-secondary p-2">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
      </div>
      {trend && trendValue && (
        <div className="mt-2 flex items-center gap-1">
          <span
            className={cn(
              "text-xs font-medium",
              trend === "up" && "text-low",
              trend === "down" && "text-critical",
              trend === "neutral" && "text-muted-foreground"
            )}
          >
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
          </span>
          <span className="text-xs text-muted-foreground">vs last week</span>
        </div>
      )}
      {/* Mini sparkline placeholder */}
      <div className="mt-3 h-8 w-full">
        <svg viewBox="0 0 100 24" className="h-full w-full">
          <path
            d="M0 20 Q 10 15, 20 18 T 40 12 T 60 16 T 80 8 T 100 10"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>
      </div>
    </div>
  );
}
