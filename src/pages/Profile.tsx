import { Header } from "@/components/dashboard/Header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { mockCases } from "@/data/mock-cases";
import { Phone, Mail, MapPin, Calendar, FileText, ArrowLeft, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import fieldWorkerImage from "@/assets/field-worker.jpg";
import indiaMapBg from "@/assets/india-map-bg.jpg";

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
          <div className="bg-card rounded-lg border shadow-card overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary to-primary/60 relative">
              <div className="absolute inset-0 opacity-30">
                <img src={indiaMapBg} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="absolute top-2 right-3 flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                <Shield className="w-3.5 h-3.5 text-white" />
                <span className="text-xs text-white font-medium">SafeText India</span>
              </div>
            </div>
            <div className="p-6 -mt-12 relative">
              <div className="flex items-end gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-xl overflow-hidden border-4 border-card shadow-lg">
                    <img 
                      src={fieldWorkerImage} 
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-low rounded-full border-2 border-card flex items-center justify-center">
                    <span className="text-[10px]">✓</span>
                  </div>
                </div>
                <div className="flex-1 pb-2">
                  <h2 className="text-2xl font-semibold mb-1">{profile.name}</h2>
                  <p className="text-muted-foreground">{profile.role}</p>
                </div>
              </div>

              <div className="grid gap-3 mt-6">
                <div className="flex items-center gap-3 text-sm p-3 bg-secondary/50 rounded-lg">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>{profile.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm p-3 bg-secondary/50 rounded-lg">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm p-3 bg-secondary/50 rounded-lg">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>Member since {profile.joinDate}</span>
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
                <div className="flex gap-4">
                  <div className="flex-1 p-3 bg-secondary/50 rounded-lg">
                    <span className="text-xs text-muted-foreground block mb-1">Latitude</span>
                    <span className="font-mono text-sm">{userLocation.lat.toFixed(6)}</span>
                  </div>
                  <div className="flex-1 p-3 bg-secondary/50 rounded-lg">
                    <span className="text-xs text-muted-foreground block mb-1">Longitude</span>
                    <span className="font-mono text-sm">{userLocation.lng.toFixed(6)}</span>
                  </div>
                </div>
                <div className="h-40 rounded-lg overflow-hidden relative">
                  <img 
                    src={indiaMapBg} 
                    alt="Location Map"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/60 to-transparent" />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                      <div className="w-5 h-5 rounded-full bg-primary border-2 border-card shadow-lg" />
                      <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
                    </div>
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
