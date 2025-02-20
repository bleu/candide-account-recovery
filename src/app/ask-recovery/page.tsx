"use client";

import { NewAddress } from "@/components/guardian-list";
import SafeAddress from "@/components/ask-recovery-steps/safe-address";
import NewOwners from "@/components/ask-recovery-steps/new-owners";
import NewThreshold from "@/components/ask-recovery-steps/new-threshold";
import ShareLink from "@/components/ask-recovery-steps/share-link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { isAddress } from "viem";
import { createFinalUrl } from "@/utils/recovery-link";

const isBrowser = typeof window !== "undefined";
import { useGuardians } from "@/hooks/useGuardians";
import { BaseForm } from "@/components/base-form";
import { useSocialRecoveryModule } from "@/hooks/use-social-recovery-module";
import { useOwners } from "@/hooks/useOwners";
import { areAddressListsEqual } from "@/utils/are-address-lists-equal";
import { useAccount, useChains } from "wagmi";

const totalSteps = 4;

export default function AskRecovery() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [safeAddress, setSafeAddress] = useState("");
  const [newOwners, setOwners] = useState<NewAddress[]>([]);
  const [threshold, setThreshold] = useState(1);
  const [safeAddressError, setSafeAddressError] = useState<string>("");

  const [chainId, setChainId] = useState<string>("1");
  const { chainId: accountChainId } = useAccount();
  const chains = useChains();

  const { srm } = useSocialRecoveryModule({
    safeAddress,
    chainId: Number(chainId),
  });

  const link =
    srm && chainId
      ? createFinalUrl({
          safeAddress,
          newThreshold: threshold,
          newOwners: newOwners.map((guardian) => guardian.address),
          chainId,
        })
      : "";

  const { data: guardians } = useGuardians(
    safeAddress as `0x${string}`,
    Number(chainId)
  );

  const { data: owners } = useOwners(
    safeAddress as `0x${string}`,
    Number(chainId)
  );

  // Automatically set default chain if user connects on wallet
  useEffect(() => {
    if (
      accountChainId &&
      chains.map((chain) => chain.id).includes(accountChainId) &&
      currentStep == 1
    ) {
      setChainId(accountChainId.toString());
    }
  }, [accountChainId, chains, setChainId, currentStep]);

  const isNextDisabled =
    (currentStep === 1 && !safeAddress) ||
    (currentStep === 2 && newOwners.length === 0);

  const handleNext = () => {
    switch (currentStep) {
      case 1: {
        if (!isAddress(safeAddress)) {
          setSafeAddressError("Insert a valid address.");
          break;
        }
        if (!guardians) {
          setSafeAddressError(
            "Couldn't fetch guardians. Maybe this safe address has no guardians on the selected chain."
          );
          break;
        }
        setSafeAddressError("");
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
        if (isBrowser) {
          navigator.clipboard.writeText(link);
        }
      default:
        break;
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      if (currentStep === 4) {
        router.push(link);
      } else {
        setCurrentStep((prev) => prev - 1);
      }
    }
  };

  const handleAdd = (newOwner: NewAddress): void => {
    setOwners((prev) => [...prev, newOwner]);
  };

  const handleRemove = (index: number): void => {
    setOwners((prev) => prev.filter((_, i) => i !== index));
  };

  const handleExternalLink = (address: string): void => {
    if (isBrowser) {
      window.open(`https://etherscan.io/address/${address}`);
    }
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
          reason: "This safe address can't be an owner.",
        };
      if (!guardians)
        return {
          isValid: false,
          reason: "Couldn't fetch guardians.",
        };
      if (guardians.includes(address))
        return {
          isValid: false,
          reason: "Guardians can't be new owners.",
        };
      if (!owners)
        return {
          isValid: false,
          reason: "Couldn't fetch owners.",
        };
      if (
        areAddressListsEqual(
          [...newOwners.map((newOwner) => newOwner.address), address],
          owners
        )
      )
        return {
          isValid: false,
          reason: "New owners exactly match old owners.",
        };
      return { isValid: true, reason: "" };
    },
    [safeAddress, guardians, owners, newOwners]
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
            chainId={chainId}
            onChainIdChange={(value: string) => setChainId(value)}
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
      <BaseForm
        title={getStepTitle()}
        description={getStepDescription()}
        currentStep={currentStep}
        totalSteps={totalSteps}
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
      </BaseForm>
    </div>
  );
}
