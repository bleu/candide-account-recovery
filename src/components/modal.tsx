import { cn } from "@/lib/utils";
import DialogProgressBar from "./dialog-progress-bar";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface ModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  nextLabel?: string;
  backLabel?: string;
  isNextDisabled?: boolean;
  isBackDisabled?: boolean;
  isProgress?: boolean;
  onBack?: () => void;
  onNext?: () => void;
  onClose: () => void;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  currentStep,
  totalSteps,
  isProgress,
  onBack,
  onNext,
  nextLabel = "Next",
  backLabel = "Back",
  isNextDisabled = false,
  isBackDisabled = false,
}: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex flex-col gap-4 flex-1 max-w-2xl bg-content-background border-none rounded-3xl">
        <div className="flex flex-col gap-8">
          <div>
            {isProgress && (
              <div className="flex gap-2 mb-8 pr-5">
                {Array.from({ length: totalSteps }, (_, index) => (
                  <DialogProgressBar
                    key={index}
                    isSelected={index + 1 === currentStep!}
                  />
                ))}
              </div>
            )}
            <DialogHeader>
              <DialogTitle className="text-xl font-bold font-roboto-mono">
                {title}
              </DialogTitle>
              {description && (
                <DialogDescription className="text-base font-medium opacity-60 font-roboto-mono">
                  {description}
                </DialogDescription>
              )}
            </DialogHeader>
          </div>
          <div className="flex-1">{children}</div>
          <DialogFooter
            className={cn(isProgress ? "sm:justify-end" : "sm:justify-center")}
          >
            {(onBack || onNext) && (
              <div className="flex gap-3">
                {onBack && currentStep !== 1 && (
                  <Button
                    variant="outline"
                    onClick={onBack}
                    disabled={isBackDisabled}
                    className="px-6 py-2"
                  >
                    {backLabel}
                  </Button>
                )}
                {onNext && (
                  <Button
                    onClick={onNext}
                    disabled={isNextDisabled}
                    className="px-6 py-2"
                  >
                    {nextLabel}
                  </Button>
                )}
              </div>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
