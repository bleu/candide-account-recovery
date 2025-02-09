"use client";
import { useEffect, useState } from "react";

import { Modal } from "@/components/modal";
import GuardiansStep from "@/components/protect-account-steps/guardians";
import ReviewStepSection from "@/components/protect-account-steps/review";
import DelayPeriodStep from "@/components/protect-account-steps/delay-period";
import ThresholdStep from "@/components/protect-account-steps/threshold";
import { ConnectWalletButton } from "@/components/connect-wallet-button";
import { useAccount } from "wagmi";
import { useAddGuardians } from "@/hooks/useAddGuardians";
import { Address } from "viem";
import { storeGuardians } from "@/utils/storage";
import { redirect } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { NewAddress } from "@/components/guardian-list";
import LoadingModal from "@/components/loading-modal";
import { getTransactionLoadingText } from "@/utils/transaction";

const totalSteps = 4;

export default function ProtectAccount() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isOpen, setIsOpen] = useState(true);
  const [threshold, setThreshold] = useState(1);
  const [delayPeriod, setDelayPeriod] = useState(3);

  const [guardians, setGuardians] = useState<NewAddress[]>([]);

  const {
    address,
    chainId,
    isConnected: isWalletConnected,
    isConnecting: isWalletConnecting,
  } = useAccount();

  const {
    txHashes,
    addGuardians: postGuardians,
    error: errorPostGuardians,
    isLoading: isLoadingPostGuardians,
    state,
  } = useAddGuardians(
    guardians.map((guardian) => guardian.address) as Address[],
    threshold
  );

  const { toast } = useToast();

  useEffect(() => {
    if (txHashes.length > 0) {
      if (state === "success") {
        if (chainId && address) {
          storeGuardians(
            guardians.filter((guardian) => guardian.status === "added"),
            chainId,
            address
          );
        }
        toast({
          title: "Guardian added.",
          description:
            "Your new guardian will now be part of your account recovery setup.",
        });
        setIsOpen(false);
        redirect("/manage-recovery/dashboard");
      } else if (state === "reverted") {
        toast({
          title: "Adding guardian failed.",
          description: "The transaction was reverted. Please try again.",
          isWarning: true,
        });
      } else if (state === "executing") {
        toast({
          title: "Adding guardian initiated.",
          description: "Please wait while the transaction is being processed.",
        });
      }
    }
  }, [txHashes, state, chainId, address, guardians, toast]);

  const handleAddGuardian = (newGuardian: NewAddress): void => {
    setGuardians((prev) => [...prev, newGuardian]);
  };

  const handleRemoveGuardian = (index: number): void => {
    setGuardians((prev) => prev.filter((_, i) => i !== index));
  };

  const handleExternalLink = (address: string): void => {
    window.open(`https://etherscan.io/address/${address}`);
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      postGuardians();
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
              onAddGuardian={handleAddGuardian}
              onExternalLink={handleExternalLink}
              onRemoveGuardian={handleRemoveGuardian}
            />
          </div>
        );
      case 2:
        return (
          <ThresholdStep
            totalGuardians={guardians.length}
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
                  isReview={true}
                />
              </div>
              <ReviewStepSection
                threshold={threshold}
                delayPeriod={delayPeriod}
              />
              <br />
              {errorPostGuardians && (
                <p className="text-alert font-roboto-mono font-medium text-sm mt-2">
                  {errorPostGuardians}
                </p>
              )}
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
        <>
          <Modal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title={getStepTitle()}
            description={getStepDescription()}
            currentStep={currentStep}
            totalSteps={totalSteps}
            onNext={handleNext}
            onBack={handleBack}
            isNextDisabled={
              (currentStep === 1 && guardians.length === 0) ||
              (currentStep === 4 && isLoadingPostGuardians)
            }
            nextLabel={
              currentStep === 3
                ? "Finish and Review"
                : currentStep === 4
                ? isLoadingPostGuardians
                  ? "Loading..."
                  : "Setup Recovery"
                : "Next"
            }
            isProgress
          >
            {getStepContent()}
          </Modal>
          <LoadingModal
            loading={isLoadingPostGuardians}
            loadingText={getTransactionLoadingText(
              state,
              "Setting up account recovery"
            )}
          />
        </>
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
