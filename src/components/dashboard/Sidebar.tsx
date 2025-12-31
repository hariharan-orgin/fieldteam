import { cn } from "@/lib/utils";
import { NavLink } from "@/components/NavLink";
import {
  Home,
  FileText,
  Map,
  AlertTriangle,
  Activity,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useAvailability } from "@/contexts/AvailabilityContext";
import { useToast } from "@/hooks/use-toast";

interface SidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  assignedCasesCount?: number;
  highlightCases?: boolean;
}

const menuItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: FileText, label: "Assigned Cases", path: "/cases", badge: true },
  { icon: Map, label: "Map", path: "/map" },
  { icon: AlertTriangle, label: "SLA Alerts", path: "/alerts" },
  { icon: Activity, label: "Activity Log", path: "/activity" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function Sidebar({
  collapsed = false,
  onCollapse,
  assignedCasesCount = 5,
  highlightCases = false,
}: SidebarProps) {
  const { isAvailable, setIsAvailable } = useAvailability();
  const { toast } = useToast();

  const handleAvailabilityChange = (checked: boolean) => {
    setIsAvailable(checked);
    if (!checked) {
      toast({
        title: "You are offline",
        description: "You will not receive new assignments.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "You are online",
        description: "You will now receive new assignments.",
      });
    }
  };

  return (
    <aside
      className={cn(
        "flex flex-col bg-sidebar border-r border-sidebar-border h-screen transition-all duration-300 fixed left-0 top-0 z-40",
        collapsed ? "w-16" : "w-[260px]"
      )}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary">
          <Shield className="w-5 h-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-semibold text-sm">SafeText</span>
            <span className="text-[10px] text-muted-foreground">
              Field Team
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isHighlighted = highlightCases && item.path === "/cases";
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isHighlighted && "ring-2 ring-destructive animate-pulse"
              )}
              activeClassName="bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
            >
              <item.icon className={cn("w-5 h-5 flex-shrink-0", isHighlighted && "text-destructive")} />
              {!collapsed && (
                <>
                  <span className={cn("flex-1", isHighlighted && "text-destructive font-semibold")}>{item.label}</span>
                  {item.badge && assignedCasesCount > 0 && (
                    <Badge
                      variant="destructive"
                      className={cn(
                        "h-5 min-w-5 px-1.5 text-[10px]",
                        isHighlighted && "animate-bounce"
                      )}
                    >
                      {assignedCasesCount}
                    </Badge>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Availability Toggle */}
      <div className="px-3 py-4 border-t border-sidebar-border">
        {!collapsed ? (
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  isAvailable ? "bg-low" : "bg-muted-foreground"
                )}
              />
              <span className="text-sm">Availability</span>
            </div>
            <Switch
              checked={isAvailable}
              onCheckedChange={handleAvailabilityChange}
              aria-label="Toggle availability"
            />
          </div>
        ) : (
          <div className="flex justify-center">
            <div
              className={cn(
                "w-3 h-3 rounded-full",
                isAvailable ? "bg-low" : "bg-muted-foreground"
              )}
            />
          </div>
        )}
      </div>

      {/* Collapse Button */}
      <div className="px-3 py-3 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center"
          onClick={() => onCollapse?.(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 mr-2" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
