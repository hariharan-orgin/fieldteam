import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

export function useCaseNotes(caseId: string, initialNotes: string = "") {
  const { toast } = useToast();
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem(`case-notes-${caseId}`);
    return saved || initialNotes;
  });
  const [isSaving, setIsSaving] = useState(false);

  const saveNotes = useCallback(() => {
    setIsSaving(true);
    // Simulate save delay
    setTimeout(() => {
      localStorage.setItem(`case-notes-${caseId}`, notes);
      setIsSaving(false);
      toast({
        title: "Notes Saved",
        description: `Field notes for ${caseId} have been saved.`,
      });
    }, 300);
  }, [caseId, notes, toast]);

  return {
    notes,
    setNotes,
    saveNotes,
    isSaving,
  };
}
