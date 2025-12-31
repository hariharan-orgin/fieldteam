import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface AvailabilityContextType {
  isAvailable: boolean;
  setIsAvailable: (value: boolean) => void;
  goOnline: () => void;
  goOffline: () => void;
}

const AvailabilityContext = createContext<AvailabilityContextType | undefined>(undefined);

export function AvailabilityProvider({ children }: { children: React.ReactNode }) {
  const [isAvailable, setIsAvailableState] = useState(() => {
    const saved = localStorage.getItem("userSettings");
    if (saved) {
      const settings = JSON.parse(saved);
      return settings.availability ?? true;
    }
    return true;
  });

  // Sync with localStorage
  useEffect(() => {
    const saved = localStorage.getItem("userSettings");
    const settings = saved ? JSON.parse(saved) : {};
    settings.availability = isAvailable;
    localStorage.setItem("userSettings", JSON.stringify(settings));
  }, [isAvailable]);

  const setIsAvailable = useCallback((value: boolean) => {
    setIsAvailableState(value);
  }, []);

  const goOnline = useCallback(() => {
    setIsAvailableState(true);
  }, []);

  const goOffline = useCallback(() => {
    setIsAvailableState(false);
  }, []);

  return (
    <AvailabilityContext.Provider
      value={{
        isAvailable,
        setIsAvailable,
        goOnline,
        goOffline,
      }}
    >
      {children}
    </AvailabilityContext.Provider>
  );
}

export function useAvailability() {
  const context = useContext(AvailabilityContext);
  if (context === undefined) {
    throw new Error("useAvailability must be used within an AvailabilityProvider");
  }
  return context;
}
