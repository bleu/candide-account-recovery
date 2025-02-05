import React from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import LoadingSpinner from "./ui/loading-spinner";

interface LoadingModalProps {
  loading: boolean;
  loadingText?: string;
}

export default function LoadingModal({
  loading,
  loadingText,
}: LoadingModalProps) {
  return (
    <Dialog open={loading}>
      <DialogContent className="flex flex-col bg-content-background border-none rounded-3xl items-center [&>button]:hidden">
        <LoadingSpinner />
        <DialogTitle className="font-roboto-mono font-normal text-base text-content-foreground opacity-60">
          {loadingText || "Loading..."}
        </DialogTitle>
      </DialogContent>
    </Dialog>
  );
}
