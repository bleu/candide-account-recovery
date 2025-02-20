import React from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import LoadingSpinner from "./ui/loading-spinner";
import { Button } from "./ui/button";

interface LoadingModalProps {
  loading: boolean;
  loadingText?: string;
  onCancel?: () => void;
}

export default function LoadingModal({
  loading,
  loadingText,
  onCancel,
}: LoadingModalProps) {
  return (
    <Dialog open={loading} onOpenChange={onCancel}>
      <DialogContent className="flex flex-col bg-content-background border-none rounded-3xl items-center py-16">
        <LoadingSpinner />
        <DialogTitle className="font-roboto-mono font-normal text-base text-content-foreground opacity-60">
          {loadingText || "Loading..."}
        </DialogTitle>
        <Button onClick={onCancel} className="px-6 py-2">
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
}
