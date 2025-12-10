import { Header } from "@/components/dashboard/Header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Bell, Smartphone, Mail, Shield, Check } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const { settings, updateProfile, updateNotifications, updateAvailability, saveSettings } =
    useSettings();

  const handleSave = () => {
    const saved = saveSettings();
    if (saved) {
      toast({
        title: "Settings Saved",
        description: "Your preferences have been saved permanently.",
      });
    }
  };

  const initials = settings.profile.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header title="Settings" showSearch={false} />

      <ScrollArea className="flex-1">
        <div className="p-6 max-w-2xl space-y-8">
          {/* Profile Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Profile</h2>
            </div>
            <div className="bg-card rounded-lg border shadow-card p-6 space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{settings.profile.name}</p>
                  <p className="text-sm text-muted-foreground">Field Team Member</p>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={settings.profile.name}
                    onChange={(e) => updateProfile({ name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={settings.profile.phone}
                    onChange={(e) => updateProfile({ phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.profile.email}
                    onChange={(e) => updateProfile({ email: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Notification Preferences</h2>
            </div>
            <div className="bg-card rounded-lg border shadow-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive alerts on your device
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.notifications.push}
                  onCheckedChange={(checked) => updateNotifications({ push: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive text message alerts
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.notifications.sms}
                  onCheckedChange={(checked) => updateNotifications({ sms: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive email summaries
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) => updateNotifications({ email: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Critical Alerts Only</p>
                    <p className="text-sm text-muted-foreground">
                      Only notify for critical and overdue cases
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.notifications.criticalOnly}
                  onCheckedChange={(checked) => updateNotifications({ criticalOnly: checked })}
                />
              </div>
            </div>
          </div>

          {/* Availability */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Availability</h2>
            </div>
            <div className="bg-card rounded-lg border shadow-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Available for Assignments</p>
                  <p className="text-sm text-muted-foreground">
                    Toggle off to stop receiving new case assignments
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      settings.availability ? "bg-low" : "bg-muted-foreground"
                    }`}
                  />
                  <Switch
                    checked={settings.availability}
                    onCheckedChange={updateAvailability}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button className="rounded-button" onClick={handleSave}>
              <Check className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
