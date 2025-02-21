// components/stepper.tsx
import { cn } from "@/lib/utils";
import DialogProgressBar from "./dialog-progress-bar";
import { Button } from "./ui/button";

interface StepperProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  nextLabel?: string;
  backLabel?: string;
  isNextDisabled?: boolean;
  isBackDisabled?: boolean;
  isProgress?: boolean;
  onBack?: () => void;
  onNext?: () => void;
}

export function BaseForm({
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
}: StepperProps) {
  return (
    <div className="flex flex-col gap-4 flex-1 max-w-2xl mx-auto bg-content-background rounded-3xl p-6 mb-16">
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
          <div className="space-y-2">
            <h2 className="text-xl font-bold font-roboto-mono">{title}</h2>
            {description && (
              <p className="text-base font-medium opacity-60 font-roboto-mono">
                {description}
              </p>
            )}
          </div>
        </div>
        {children && <div className="flex-1">{children}</div>}
        <div
          className={cn("flex", isProgress ? "justify-end" : "justify-center")}
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
        </div>
      </div>
    </div>
  );
}
