import { Header } from "@/components/dashboard/Header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { mockCases } from "@/data/mock-cases";
import { User, Phone, Mail, MapPin, Calendar, FileText, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface UserProfile {
  name: string;
  phone: string;
  email: string;
  role: string;
  joinDate: string;
  location: { lat: number; lng: number } | null;
}

export default function Profile() {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Get saved profile from localStorage or use defaults
  const savedProfile = localStorage.getItem("userProfile");
  const profile: UserProfile = savedProfile
    ? JSON.parse(savedProfile)
    : {
        name: "John Doe",
        phone: "+1 (555) 123-4567",
        email: "john.doe@safetext.com",
        role: "Field Team Member",
        joinDate: "January 2024",
      };

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  // Get cases handled by this user (simulating with all resolved cases)
  const previousCases = mockCases.filter((c) => c.status === "resolved" || c.status === "in_progress");

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header title="Profile" showSearch={false} />

      <ScrollArea className="flex-1">
        <div className="p-6 max-w-3xl space-y-6">
          {/* Back Button */}
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {/* Profile Card */}
          <div className="bg-card rounded-lg border shadow-card p-6">
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                  {profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-1">{profile.name}</h2>
                <p className="text-muted-foreground mb-4">{profile.role}</p>

                <div className="grid gap-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{profile.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Member since {profile.joinDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Current Location */}
          <div className="bg-card rounded-lg border shadow-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Current Location</h3>
            </div>
            {userLocation ? (
              <div className="space-y-3">
                <div className="text-sm">
                  <span className="text-muted-foreground">Latitude: </span>
                  <span className="font-mono">{userLocation.lat.toFixed(6)}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Longitude: </span>
                  <span className="font-mono">{userLocation.lng.toFixed(6)}</span>
                </div>
                <div className="h-40 bg-gradient-to-br from-secondary to-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `
                        linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
                        linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
                      `,
                      backgroundSize: "30px 30px",
                    }}
                  />
                  <div className="relative">
                    <div className="w-5 h-5 rounded-full bg-primary border-2 border-card shadow-lg" />
                    <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                Location access denied or unavailable
              </p>
            )}
          </div>

          {/* Previous Cases */}
          <div className="bg-card rounded-lg border shadow-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Previous Cases Handled</h3>
              <span className="text-muted-foreground text-sm">({previousCases.length})</span>
            </div>

            {previousCases.length > 0 ? (
              <div className="space-y-3">
                {previousCases.map((caseData) => (
                  <div
                    key={caseData.id}
                    className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-sm">{caseData.id}</span>
                      <SeverityBadge severity={caseData.severity} />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{caseData.location}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs capitalize ${
                          caseData.status === "resolved"
                            ? "bg-low/10 text-low"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {caseData.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No previous cases</p>
            )}
          </div>

          {/* Edit Profile Button */}
          <div className="flex justify-end">
            <Button onClick={() => navigate("/settings")} className="rounded-button">
              Edit Profile Settings
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
