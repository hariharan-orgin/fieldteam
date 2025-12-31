import { useState, useEffect, useCallback, useRef } from "react";
import { mockCases } from "@/data/mock-cases";
import { Case } from "@/types/case";

interface UseAssignmentListenerProps {
  userId?: string;
  isAvailable: boolean;
  onNewAssignment?: (caseData: Case) => void;
}

interface UseAssignmentListenerReturn {
  newAssignment: Case | null;
  showPopup: boolean;
  dismissPopup: () => void;
  clearNewAssignment: () => void;
  hasNewAssignments: boolean;
}

// Sound alert utility
const playAlertSound = () => {
  try {
    const audio = new Audio("/alert.mp3");
    audio.volume = 0.7;
    audio.play().catch((err) => {
      console.warn("Could not play alert sound:", err);
    });
  } catch (error) {
    console.warn("Audio playback error:", error);
  }
};

// Browser notification utility
const showBrowserNotification = (title: string, body: string) => {
  if (!("Notification" in window)) {
    console.warn("Browser does not support notifications");
    return;
  }

  if (Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon: "/favicon.ico",
      tag: "new-assignment",
      requireInteraction: true,
    });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification(title, {
          body,
          icon: "/favicon.ico",
          tag: "new-assignment",
          requireInteraction: true,
        });
      }
    });
  }
};

export function useAssignmentListener({
  userId = "field-team-1",
  isAvailable,
  onNewAssignment,
}: UseAssignmentListenerProps): UseAssignmentListenerReturn {
  const [newAssignment, setNewAssignment] = useState<Case | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [hasNewAssignments, setHasNewAssignments] = useState(false);
  const lastKnownCaseCount = useRef(mockCases.length);
  const soundPlayedForCurrent = useRef(false);

  // Simulate Firestore listener - replace with real Firebase onSnapshot
  useEffect(() => {
    // Request notification permission on mount
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    // Simulate real-time listener with interval
    // In production, replace with:
    // const unsubscribe = onSnapshot(
    //   collection(db, `assignments/${userId}/activeCases`),
    //   (snapshot) => {
    //     snapshot.docChanges().forEach((change) => {
    //       if (change.type === "added") {
    //         handleNewAssignment(change.doc.data() as Case);
    //       }
    //     });
    //   }
    // );

    const checkForNewAssignments = () => {
      const currentCount = mockCases.length;
      
      // Simulate new assignment detection
      // For demo: randomly trigger after 30 seconds if offline
      if (!isAvailable && Math.random() > 0.95) {
        const simulatedNewCase = mockCases[0]; // Use first case as example
        handleNewAssignment(simulatedNewCase);
      }
    };

    const interval = setInterval(checkForNewAssignments, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [isAvailable, userId]);

  const handleNewAssignment = useCallback(
    (caseData: Case) => {
      setNewAssignment(caseData);
      setHasNewAssignments(true);
      onNewAssignment?.(caseData);

      if (!isAvailable) {
        // User is offline - trigger all alerts
        setShowPopup(true);

        // Play sound only once per new assignment
        if (!soundPlayedForCurrent.current) {
          playAlertSound();
          soundPlayedForCurrent.current = true;
        }

        // Show browser notification
        showBrowserNotification(
          "New Assignment Received",
          "You are offline. Switch to online to accept the case."
        );
      }
    },
    [isAvailable, onNewAssignment]
  );

  const dismissPopup = useCallback(() => {
    setShowPopup(false);
    soundPlayedForCurrent.current = false; // Allow sound to play again for next assignment
  }, []);

  const clearNewAssignment = useCallback(() => {
    setNewAssignment(null);
    setShowPopup(false);
    setHasNewAssignments(false);
    soundPlayedForCurrent.current = false;
  }, []);

  // Expose function to manually trigger for testing
  // @ts-ignore - for debugging purposes
  if (typeof window !== "undefined") {
    (window as any).__triggerNewAssignment = () => {
      handleNewAssignment(mockCases[0]);
    };
  }

  return {
    newAssignment,
    showPopup,
    dismissPopup,
    clearNewAssignment,
    hasNewAssignments,
  };
}

// Export utilities for use in other components
export { playAlertSound, showBrowserNotification };
