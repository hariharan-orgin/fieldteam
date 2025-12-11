import { useState, useCallback, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from "@react-google-maps/api";
import { Case } from "@/types/case";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Key } from "lucide-react";

interface GoogleMapComponentProps {
  cases?: Case[];
  userLocation?: { lat: number; lng: number } | null;
  selectedCase?: Case | null;
  onCaseClick?: (caseData: Case) => void;
  showDirections?: boolean;
  className?: string;
  height?: string;
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

// Default center: India (Delhi)
const defaultCenter = {
  lat: 28.6139,
  lng: 77.2090,
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: true,
  fullscreenControl: true,
  styles: [
    {
      featureType: "all",
      elementType: "geometry.fill",
      stylers: [{ saturation: -20 }],
    },
    {
      featureType: "water",
      elementType: "geometry.fill",
      stylers: [{ color: "#a3ccff" }],
    },
  ],
};

const severityMarkerColors: Record<string, string> = {
  critical: "#E02424",
  high: "#F97316",
  medium: "#FBBF24",
  low: "#10B981",
};

export function GoogleMapComponent({
  cases = [],
  userLocation,
  selectedCase,
  onCaseClick,
  showDirections = false,
  className,
  height = "400px",
}: GoogleMapComponentProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [inputApiKey, setInputApiKey] = useState("");
  const [apiKey, setApiKey] = useState(() => {
    // Check localStorage first, then env variable
    return localStorage.getItem("GOOGLE_MAPS_API_KEY") || import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Generate mock coordinates for cases (in real app, cases would have lat/lng)
  const getCaseCoordinates = (caseData: Case, index: number) => {
    // Mock coordinates around major Indian cities
    const indianCities = [
      { lat: 28.6139, lng: 77.2090 }, // Delhi
      { lat: 19.0760, lng: 72.8777 }, // Mumbai
      { lat: 12.9716, lng: 77.5946 }, // Bangalore
      { lat: 22.5726, lng: 88.3639 }, // Kolkata
      { lat: 13.0827, lng: 80.2707 }, // Chennai
      { lat: 17.3850, lng: 78.4867 }, // Hyderabad
      { lat: 23.0225, lng: 72.5714 }, // Ahmedabad
      { lat: 26.9124, lng: 75.7873 }, // Jaipur
    ];
    return indianCities[index % indianCities.length];
  };

  const handleSaveApiKey = () => {
    if (inputApiKey.trim()) {
      localStorage.setItem("GOOGLE_MAPS_API_KEY", inputApiKey.trim());
      setApiKey(inputApiKey.trim());
    }
  };

  // Calculate directions when needed
  useEffect(() => {
    if (showDirections && userLocation && selectedCase && map) {
      const directionsService = new google.maps.DirectionsService();
      const caseIndex = cases.findIndex((c) => c.id === selectedCase.id);
      const destination = getCaseCoordinates(selectedCase, caseIndex >= 0 ? caseIndex : 0);

      directionsService.route(
        {
          origin: userLocation,
          destination,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            setDirections(result);
          }
        }
      );
    }
  }, [showDirections, userLocation, selectedCase, map, cases]);

  if (!apiKey) {
    return (
      <div 
        className={`flex flex-col items-center justify-center bg-card rounded-lg border p-6 ${className}`}
        style={{ height }}
      >
        <Key className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="font-semibold text-lg mb-2">Google Maps API Key Required</h3>
        <p className="text-muted-foreground text-sm text-center mb-4 max-w-sm">
          Enter your Google Maps API key to enable live map features.
          Get one from <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener" className="text-primary hover:underline">Google Cloud Console</a>
        </p>
        <div className="flex gap-2 w-full max-w-sm">
          <Input
            type="password"
            placeholder="Enter API key..."
            value={inputApiKey}
            onChange={(e) => setInputApiKey(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSaveApiKey} disabled={!inputApiKey.trim()}>
            Save
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={{ height }}>
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={userLocation || defaultCenter}
          zoom={userLocation ? 12 : 5}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={mapOptions}
        >
          {/* User location marker */}
          {userLocation && (
            <Marker
              position={userLocation}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: "#2563EB",
                fillOpacity: 1,
                strokeColor: "#FFFFFF",
                strokeWeight: 3,
              }}
              title="Your Location"
            />
          )}

          {/* Case markers */}
          {cases.map((caseData, index) => {
            const position = getCaseCoordinates(caseData, index);
            return (
              <Marker
                key={caseData.id}
                position={position}
                onClick={() => onCaseClick?.(caseData)}
                icon={{
                  path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                  scale: 6,
                  fillColor: severityMarkerColors[caseData.severity],
                  fillOpacity: 1,
                  strokeColor: "#FFFFFF",
                  strokeWeight: 2,
                }}
                title={`${caseData.id} - ${caseData.severity}`}
              />
            );
          })}

          {/* Directions */}
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
