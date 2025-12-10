import { Search, Filter, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface HeaderProps {
  title: string;
  showSearch?: boolean;
}

export function Header({ title, showSearch = true }: HeaderProps) {
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
            />
          </div>
        )}

        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Filter className="w-4 h-4" />
        </Button>

        <Button variant="ghost" size="icon" className="h-9 w-9 relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-critical rounded-full" />
        </Button>

        <Avatar className="h-9 w-9 cursor-pointer">
          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
            JD
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
