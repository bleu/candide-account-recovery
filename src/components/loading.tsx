"use client";

import { useSearchStore } from "@/stores/useSearchStore";
import LoadingSpinner from "./ui/loading-spinner";

export default function Loading() {
  const isLoading = useSearchStore((state) => state.isLoading);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
        <LoadingSpinner className="flex flex-1 items-center justify-center" />
      </div>
    </div>
  );
}
