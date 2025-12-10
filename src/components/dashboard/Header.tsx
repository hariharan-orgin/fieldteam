import { Search, Filter, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockCases } from "@/data/mock-cases";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  title: string;
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onFilterClick?: () => void;
}

export function Header({
  title,
  showSearch = true,
  searchValue = "",
  onSearchChange,
  onFilterClick,
}: HeaderProps) {
  const navigate = useNavigate();

  // Get urgent/critical cases count for notification badge
  const urgentCount = mockCases.filter(
    (c) => (c.severity === "critical" || c.severity === "high") && c.status !== "resolved"
  ).length;

  // Get saved profile
  const savedProfile = localStorage.getItem("userProfile");
  const profile = savedProfile
    ? JSON.parse(savedProfile)
    : { name: "John Doe" };
  const initials = profile.name
    .split(" ")
    .map((n: string) => n[0])
    .join("");

  const handleNotificationClick = () => {
    navigate("/cases");
  };

  return (
    <header className="flex items-center justify-between h-16 px-6 border-b border-border bg-card">
      <h1 className="text-xl font-semibold">{title}</h1>

      <div className="flex items-center gap-3">
        {showSearch && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search Case ID or Location"
              className="pl-9 w-64 h-9 text-sm"
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
          </div>
        )}

        {onFilterClick && (
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={onFilterClick}>
            <Filter className="w-4 h-4" />
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 relative"
          onClick={handleNotificationClick}
        >
          <Bell className="w-4 h-4" />
          {urgentCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 min-w-5 px-1.5 text-[10px]"
            >
              {urgentCount}
            </Badge>
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-9 w-9 cursor-pointer">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-muted-foreground">
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
