"use client";
import { ProgressModal } from "@/components/progress-modal";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

import { useState } from "react";

const isWalletConnected = true;
const totalSteps = 4;

export default function ProtectAccount() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isOpen, setIsOpen] = useState(true);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Handle form submission
      setIsOpen(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-[1fr,2fr]">
              <div className="flex items-center">
                <label className="text-sm font-bold font-roboto-mono opacity-50">
                  NICKNAME
                </label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="p-2">
                      <Info size={14} className="opacity-50" />
                    </TooltipTrigger>
                    <TooltipContent className="px-4 py-2 max-w-56 bg-background text-xs">
                      Nicknames are saved locally in your browser. This
                      information is private and not shared with any server.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <label className="text-sm font-bold opacity-50 font-roboto-mono">
                ADDRESS
              </label>
            </div>
            <div className="grid grid-cols-[1fr,2fr] gap-2">
              <Input
                autoFocus
                placeholder="Nickname..."
                className="bg-background text-sm border-none focus:ring-primary"
              />
              <div className="flex gap-2">
                <Input
                  placeholder="Address..."
                  className="bg-background text-sm border-none focus flex-1 focus:ring-primary"
                />
                <Button
                  disabled
                  variant="ghost"
                  className="hover:bg-background text-sm"
                >
                  Add +
                </Button>
              </div>
            </div>
          </div>
        );
      case 2:
        return <div>threshold</div>;
      case 3:
      case 4:
        return <div>Review</div>;
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Add Guardians";
      case 2:
        return "Set the Approval Threshold";
      case 3:
        return "Set the Recovery Delay Period";
      case 4:
        return "Review Account Recovery Setup";
      default:
        return "";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Guardians are trusted contacts that will help recover your account. You can add multiple guardians.";
      case 2:
        return "Threshold determines the minimum number of guardian approvals required to recover your account.";
      case 3:
        return "Set the time period during which you can cancel a initiated recovery request. We recommend a period of at least 3 days.";
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center mx-8">
      {isWalletConnected ? (
        <ProgressModal
          isOpen={true}
          onClose={() => setIsOpen(false)}
          title={getStepTitle()}
          description={getStepDescription()}
          currentStep={currentStep}
          totalSteps={totalSteps}
          onNext={handleNext}
          onBack={handleBack}
        >
          {getStepContent()}
        </ProgressModal>
      ) : (
        <div className="max-w-2xl text-center">
          <h2 className="text-2xl text-primary font-bold font-roboto-mono text-center ">
            Connect the Account you want to protect.{" "}
          </h2>
          <p className="text-lg font-roboto-mono text-center text-foreground mb-6 mt-4">
            The recovery module helps you regain control of your account if your
            key is lost or compromised by relying on trusted guardians you add
            to your account.
          </p>
          <Button className="text-lg font-bold  px-4 py-2 rounded-xl">
            Connect wallet
          </Button>
        </div>
      )}
    </div>
  );
}
