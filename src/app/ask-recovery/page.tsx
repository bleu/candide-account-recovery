"use client";

import { Guardian } from "@/components/guardian-list";
import Recovery from "@/components/ask-recovery-steps/recovery";
import ShareLink from "@/components/ask-recovery-steps/share-link";
import { Modal } from "@/components/modal";
import { redirect } from "next/navigation";
import React, { useState } from "react";

const totalSteps = 2;

export default function AskRecovery() {
  const [isOpen, setIsOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [safeAddress, setSafeAddress] = useState("");
  const [guardians, setGuardians] = useState<Guardian[]>([]);

  const isNextDisabled =
    currentStep === 1 && (!safeAddress || guardians.length === 0);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsOpen(false);
      redirect("/manage-recovery/dashboard");
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

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Recovery
            safeAddress={safeAddress}
            onSafeAddressChange={setSafeAddress}
            guardians={guardians}
            onAdd={handleAdd}
            onExternalLink={handleExternalLink}
            onRemove={handleRemove}
            onValidateAddress={validateAddress}
          />
        );
      case 2:
        return <ShareLink />;
      default:
        return "";
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Ask for Recovery";
      case 2:
        return "Set the Approval Threshold";
      default:
        return "";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Your Recorevy Link was created!";
      case 2:
        return "Guardians will need to approve before the recovery can proceed. Track the progress by searching your address or cancel the request recovery if you don't need it anymore.";
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center mx-8">
      <Modal
        title={getStepTitle()}
        description={getStepDescription()}
        currentStep={currentStep}
        isOpen={isOpen}
        totalSteps={totalSteps}
        onClose={() => setIsOpen(false)}
        onNext={handleNext}
        nextLabel={currentStep === 1 ? "Generate Link" : "See Details"}
        isNextDisabled={isNextDisabled}
      >
        {getStepContent()}
      </Modal>
    </div>
  );
}
