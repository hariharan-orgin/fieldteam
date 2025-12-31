import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, Bell, Wifi } from "lucide-react";
import { Case } from "@/types/case";

interface NotificationPopupProps {
  open: boolean;
  onDismiss: () => void;
  onGoOnline: () => void;
  caseData?: Case | null;
}

export function NotificationPopup({
  open,
  onDismiss,
  onGoOnline,
  caseData,
}: NotificationPopupProps) {
  const handleGoOnline = () => {
    onGoOnline();
    onDismiss();
  };

  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onDismiss()}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <AlertDialogTitle className="text-center text-xl">
            You are Offline!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-base">
            A new case has been assigned to you.
          </AlertDialogDescription>

          {caseData && (
            <div className="mt-4 rounded-lg border bg-muted/50 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{caseData.id}</span>
              </div>
              <p className="text-sm text-muted-foreground">{caseData.location}</p>
              <p className="text-xs text-muted-foreground">
                Severity: {caseData.severity.toUpperCase()}
              </p>
            </div>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-6 flex-col gap-2 sm:flex-row">
          <AlertDialogCancel 
            onClick={onDismiss}
            className="w-full sm:w-auto"
          >
            Dismiss
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleGoOnline}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90"
          >
            <Wifi className="mr-2 h-4 w-4" />
            Go Online
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
