import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const severityBadgeVariants = cva(
  "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      severity: {
        critical: "bg-critical text-critical-foreground",
        high: "bg-high text-high-foreground",
        medium: "bg-medium text-medium-foreground",
        low: "bg-low text-low-foreground",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        default: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      severity: "low",
      size: "default",
    },
  }
);

export interface SeverityBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof severityBadgeVariants> {
  pulse?: boolean;
}

export function SeverityBadge({
  className,
  severity,
  size,
  pulse,
  children,
  ...props
}: SeverityBadgeProps) {
  return (
    <span
      className={cn(
        severityBadgeVariants({ severity, size }),
        pulse && severity === "critical" && "animate-pulse-ring",
        className
      )}
      {...props}
    >
      {children || severity?.charAt(0).toUpperCase() + severity?.slice(1)}
    </span>
  );
}
