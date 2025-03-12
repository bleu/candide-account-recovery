"use client";

import {
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";
import LoadingSpinner from "@/components/ui/loading-spinner";

type LoadingContextType = {
  isLoading: boolean;
  setIsLoading: (newIsLoading: boolean) => void;
};

export const LoadingContext = createContext({} as LoadingContextType);

export function LoadingContextProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(false);

  function Loading() {
    if (!isLoading) return null;
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
        <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
          <LoadingSpinner className="flex flex-1 items-center justify-center" />
        </div>
      </div>
    );
  }

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        setIsLoading,
      }}
    >
      <Loading />
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoadingContext() {
  const context = useContext(LoadingContext);
  return context;
}
