"use client";

import { Guardian } from "@/components/guardian-list";
import { Modal } from "@/components/modal";
import NewGuardianList from "@/components/new-guardians-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { STYLES } from "@/constants/styles";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import React, { useState } from "react";

const totalSteps = 2;

export default function AskRecovery() {
  const [isOpen, setIsOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);

  const [guardians, setGuardians] = useState<Guardian[]>([]);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsOpen(false);
      toast({
        title: "Account Recovery is setup!",
        description: "Your account is now protected.",
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const validateAddress = async (address: string): Promise<string | null> => {
    if (!address.startsWith("0x")) {
      return "Invalid address format";
    }
    return null;
  };

  const handleAdd = (newGuardian: Guardian): void => {
    setGuardians((prev) => [...prev, newGuardian]);
  };

  const handleRemove = (index: number): void => {
    setGuardians((prev) => prev.filter((_, i) => i !== index));
  };

  const handleExternalLink = (address: string): void => {
    window.open(`https://etherscan.io/address/${address}`);
  };

  return (
    <div className="flex flex-1 items-center justify-center mx-8">
      <Modal
        title="Ask for recovery"
        description="We'll generate a link for you to share with guardians or others involved in the recovery."
        currentStep={1}
        isOpen={isOpen}
        totalSteps={2}
        onClose={() => setIsOpen(false)}
        onNext={handleNext}
        onBack={handleBack}
      >
        <p className="font-roboto-mono font-bold text-base text-content-foreground">
          Safe Address
        </p>
        <p className="mt-3 mb-5 font-roboto-mono text-sm text-content-foreground opacity-60">
          The address of the account that need to be recovered.
        </p>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Address..."
            className={cn(STYLES.input, "flex-1")}
            onChange={(e) => console.log(e.target.value)}
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-background group"
            onClick={() => console.log("test")}
            type="button"
          >
            <ExternalLink
              size={16}
              className="opacity-50 group-hover:opacity-100"
            />
          </Button>
        </div>
        <p className="font-roboto-mono font-bold text-base text-content-foreground mt-7">
          Safe Signer
        </p>
        <p className="mt-3 mb-5 font-roboto-mono text-sm text-content-foreground opacity-60">
          The public address of the new Safe signer.
        </p>
        <NewGuardianList
          guardians={guardians}
          onAdd={handleAdd}
          onRemove={handleRemove}
          onExternalLink={handleExternalLink}
        />
      </Modal>
    </div>
  );
}
