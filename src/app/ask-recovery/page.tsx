"use client";

import { NewAddress } from "@/components/guardian-list";
import SafeAddress from "@/components/ask-recovery-steps/safe-address";
import NewOwners from "@/components/ask-recovery-steps/new-owners";
import NewThreshold from "@/components/ask-recovery-steps/new-threshold";
import ShareLink from "@/components/ask-recovery-steps/share-link";
import { Modal } from "@/components/modal";
import { redirect } from "next/navigation";
import React, { useCallback, useState } from "react";
import { isAddress } from "viem";
import { createFinalUrl } from "@/utils/recovery-link";

const totalSteps = 4;

export default function AskRecovery() {
  const [isOpen, setIsOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [safeAddress, setSafeAddress] = useState("");
  const [newOwners, setOwners] = useState<NewAddress[]>([]);
  const [threshold, setThreshold] = useState(1);
  const [safeAddressError, setSafeAddressError] = useState<string>("");

  const isNextDisabled =
    (currentStep === 1 && !safeAddress) ||
    (currentStep === 2 && newOwners.length === 0);

  const link = createFinalUrl({
    safeAddress,
    newThreshold: threshold,
    newOwners: newOwners.map((guardian) => guardian.address),
  });

  const handleNext = () => {
    switch (currentStep) {
      case 1: {
        if (!isAddress(safeAddress)) {
          setSafeAddressError("Insert a valid address.");
          break;
        }
        setCurrentStep((prev) => prev + 1);
        break;
      }
      case 2:
        setCurrentStep((prev) => prev + 1);
        break;
      case 3:
        setCurrentStep((prev) => prev + 1);
        break;
      case 4:
        navigator.clipboard.writeText(link);
      default:
        break;
    }
  };

  const handleBack =
    currentStep > 1
      ? () => {
          if (currentStep === 4) {
            redirect(link);
          } else {
            setCurrentStep((prev) => prev - 1);
          }
        }
      : undefined;

  const handleAdd = (newOwner: NewAddress): void => {
    setOwners((prev) => [...prev, newOwner]);
  };

  const handleRemove = (index: number): void => {
    setOwners((prev) => prev.filter((_, i) => i !== index));
  };

  const handleExternalLink = (address: string): void => {
    window.open(`https://etherscan.io/address/${address}`);
  };

  const handleThresholdChange = (value: number) => {
    setThreshold(value);
  };

  const validateNewOwner = useCallback(
    (address: string) => {
      if (!isAddress(address))
        return { isValid: false, reason: "Insert a valid address." };
      if (address === safeAddress)
        return {
          isValid: false,
          reason: "The safe address can't be an owner.",
        };
      return { isValid: true, reason: "" };
    },
    [safeAddress]
  );

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <SafeAddress
            safeAddress={safeAddress}
            onSafeAddressChange={setSafeAddress}
            onExternalLink={handleExternalLink}
            error={safeAddressError}
          />
        );
      case 2:
        return (
          <NewOwners
            newOwners={newOwners}
            onAdd={handleAdd}
            onExternalLink={handleExternalLink}
            onRemove={handleRemove}
            validationFn={validateNewOwner}
          />
        );
      case 3:
        return (
          <NewThreshold
            totalOwners={newOwners.length}
            onThresholdChange={handleThresholdChange}
          />
        );
      case 4:
        return (
          <ShareLink
            newOwners={newOwners}
            threshold={threshold}
            safeAddress={safeAddress}
            onAdd={handleAdd}
            onExternalLink={handleExternalLink}
            onRemove={handleRemove}
          />
        );
      default:
        return "";
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Ask for Recovery";
      case 2:
        return "Safe Account New Signers";
      case 3:
        return "Safe Account New Threshold";
      case 4:
        return "Summary";
      default:
        return "";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Start the recovery process to transfer account ownership through trusted contacts. New Owners approval will be required for the recovery to succeed.";
      case 2:
        return "Add the wallet addresses of the new authorized signers for the target Safe account.";
      case 3:
        return "Set a new threshold for the target Safe account. This number determines how many signers must approve each transaction after recovery is complete.";
      case 4:
        return "Review the details of your recovery request and save the tracking link.";
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
        onBack={handleBack}
        backLabel={currentStep !== 4 ? "Back" : "Details"}
        nextLabel={
          currentStep === 4
            ? "Copy Link"
            : currentStep == 3
            ? "Finish and Review"
            : "Next"
        }
        isNextDisabled={isNextDisabled}
        isProgress={currentStep !== 4}
      >
        {getStepContent()}
      </Modal>
    </div>
  );
}
