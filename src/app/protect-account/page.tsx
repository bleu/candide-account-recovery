"use client";
import { useState } from "react";

import { Guardian } from "@/components/guardian-list";
import { ProgressModal } from "@/components/progress-modal";
import GuardiansStep from "@/components/protect-account-steps/guardians";
import ReviewStepSection from "@/components/protect-account-steps/review";
import DelayPeriodStep from "@/components/protect-account-steps/delay-period";
import ThresholdStep from "@/components/protect-account-steps/threshold";
import { ConnectWalletButton } from "@/components/connect-wallet-button";
import { useAccount } from "wagmi";

interface NewGuardian {
  nickname: string;
  address: string;
}

const totalSteps = 4;

export default function ProtectAccount() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isOpen, setIsOpen] = useState(true);
  const [threshold, setThreshold] = useState(1);
  const [delayPeriod, setDelayPeriod] = useState(3);
  const [addressError, setAddressError] = useState<string>("");

  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [newGuardian, setNewGuardian] = useState<NewGuardian>({
    nickname: "",
    address: "",
  });

  const { isConnected: isWalletConnected, isConnecting: isWalletConnecting } =
    useAccount();

  const isValidAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const handleAddGuardian = (): void => {
    if (newGuardian.nickname && newGuardian.address) {
      if (!isValidAddress(newGuardian.address)) {
        setAddressError("Invalid address. Please check and try again");
        return;
      }

      setGuardians([...guardians, { ...newGuardian, status: "added" }]);
      setNewGuardian({ nickname: "", address: "" });
      setAddressError("");
    }
  };

  const handleRemoveGuardian = (index: number): void => {
    setGuardians(guardians.filter((_, i) => i !== index));
  };

  const handleExternalLink = (address: string): void => {
    window.open(`https://etherscan.io/address/${address}`);
  };

  const handleUpdateNewGuardian = (
    field: keyof NewGuardian,
    value: string
  ): void => {
    setNewGuardian((prev) => ({ ...prev, [field]: value }));

    if (field === "address") {
      setAddressError("");
    }
  };
  const isAddButtonEnabled: boolean = Boolean(
    newGuardian.nickname && newGuardian.address
  );

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsOpen(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleThresholdChange = (value: number) => {
    setThreshold(value);
  };

  const handleDelayPeriodChange = (value: number) => {
    setDelayPeriod(value);
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-5">
            <GuardiansStep
              guardians={guardians}
              isAddButtonEnabled={isAddButtonEnabled}
              newGuardian={newGuardian}
              onAddGuardian={handleAddGuardian}
              onExternalLink={handleExternalLink}
              onRemoveGuardian={handleRemoveGuardian}
              onUpdateNewGuardian={handleUpdateNewGuardian}
              errorMessage={addressError}
            />
          </div>
        );
      case 2:
        return (
          <ThresholdStep
            guardians={guardians}
            onThresholdChange={handleThresholdChange}
          />
        );
      case 3:
        return (
          <DelayPeriodStep
            delayPeriod={delayPeriod}
            onDelayPeriodChange={handleDelayPeriodChange}
          />
        );
      case 4:
        return (
          <div className="space-y-5">
            <>
              <span className="text-lg font-bold font-roboto-mono opacity-60">
                Guardians
              </span>
              <div className="mt-3">
                <GuardiansStep
                  guardians={guardians}
                  onAddGuardian={handleAddGuardian}
                  onRemoveGuardian={handleRemoveGuardian}
                  onExternalLink={handleExternalLink}
                  newGuardian={newGuardian}
                  onUpdateNewGuardian={handleUpdateNewGuardian}
                  isAddButtonEnabled={isAddButtonEnabled}
                  isReview={true}
                />
              </div>
              <ReviewStepSection
                threshold={threshold}
                delayPeriod={delayPeriod}
              />
            </>
          </div>
        );
      default:
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

  if (isWalletConnecting) return <LoadingScreen />;

  return (
    <div className="flex flex-1 items-center justify-center mx-8">
      {isWalletConnected ? (
        <ProgressModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={getStepTitle()}
          description={getStepDescription()}
          currentStep={currentStep}
          totalSteps={totalSteps}
          onNext={handleNext}
          onBack={handleBack}
          isNextDisabled={currentStep === 1 && guardians.length === 0}
          nextLabel={
            currentStep === 3
              ? "Finish and Review"
              : currentStep === 4
              ? "Setup Recovery"
              : "Next"
          }
        >
          {getStepContent()}
        </ProgressModal>
      ) : (
        <WalletNotConnected />
      )}
    </div>
  );
}

function WalletNotConnected() {
  return (
    <div className="max-w-2xl text-center">
      <h2 className="text-2xl text-primary font-bold font-roboto-mono text-center ">
        Connect the Account you want to protect.{" "}
      </h2>
      <p className="text-lg font-roboto-mono text-center text-foreground mb-6 mt-4">
        The recovery module helps you regain control of your account if your key
        is lost or compromised by relying on trusted guardians you add to your
        account.
      </p>
      <ConnectWalletButton />
    </div>
  );
}

function LoadingScreen() {
  return <div className="w-full h-full text-center"></div>;
}
