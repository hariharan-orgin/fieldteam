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
import { useState, useEffect } from "react";

interface SidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  assignedCasesCount?: number;
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
}: SidebarProps) {
  const [isAvailable, setIsAvailable] = useState(() => {
    const saved = localStorage.getItem("userSettings");
    if (saved) {
      const settings = JSON.parse(saved);
      return settings.availability ?? true;
    }
    return true;
  });

  // Sync availability with localStorage
  useEffect(() => {
    const saved = localStorage.getItem("userSettings");
    if (saved) {
      const settings = JSON.parse(saved);
      settings.availability = isAvailable;
      localStorage.setItem("userSettings", JSON.stringify(settings));
    }
  }, [isAvailable]);

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
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
            activeClassName="bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1">{item.label}</span>
                {item.badge && assignedCasesCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="h-5 min-w-5 px-1.5 text-[10px]"
                  >
                    {assignedCasesCount}
                  </Badge>
                )}
              </>
            )}
          </NavLink>
        ))}
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
              onCheckedChange={setIsAvailable}
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
