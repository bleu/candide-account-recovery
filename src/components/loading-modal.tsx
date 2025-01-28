import React from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import LoadingSpinner from "./ui/loading-spinner";

export default function LoadingModal({
  loading,
  setIsloading,
}: {
  loading: boolean;
  setIsloading: (loading: boolean) => void;
}) {
  return (
    <Dialog open={loading} onOpenChange={() => setIsloading(false)}>
      <DialogContent className="flex flex-col bg-content-background border-none rounded-3xl items-center [&>button]:hidden">
        <LoadingSpinner />
        <DialogTitle className="font-roboto-mono font-normal text-base text-content-foreground opacity-60">
          Waiting for the transaction signature...
        </DialogTitle>
      </DialogContent>
    </Dialog>
  );
}
