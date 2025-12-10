import { useState, useEffect } from "react";

interface UserProfile {
  name: string;
  phone: string;
  email: string;
}

interface NotificationSettings {
  push: boolean;
  sms: boolean;
  email: boolean;
  criticalOnly: boolean;
}

interface Settings {
  profile: UserProfile;
  notifications: NotificationSettings;
  availability: boolean;
}

const defaultSettings: Settings = {
  profile: {
    name: "John Doe",
    phone: "+1 (555) 123-4567",
    email: "john.doe@safetext.com",
  },
  notifications: {
    push: true,
    sms: true,
    email: false,
    criticalOnly: false,
  },
  availability: true,
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem("userSettings");
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem("userSettings", JSON.stringify(settings));
  }, [settings]);

  const updateProfile = (profile: Partial<UserProfile>) => {
    setSettings((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...profile },
    }));
  };

  const updateNotifications = (notifications: Partial<NotificationSettings>) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, ...notifications },
    }));
  };

  const updateAvailability = (availability: boolean) => {
    setSettings((prev) => ({ ...prev, availability }));
  };

  const saveSettings = () => {
    localStorage.setItem("userSettings", JSON.stringify(settings));
    // Also save profile separately for the Profile page
    localStorage.setItem(
      "userProfile",
      JSON.stringify({
        ...settings.profile,
        role: "Field Team Member",
        joinDate: "January 2024",
      })
    );
    return true;
  };

  return {
    settings,
    updateProfile,
    updateNotifications,
    updateAvailability,
    saveSettings,
  };
}
