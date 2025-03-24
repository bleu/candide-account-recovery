import { useState } from "react";
import { NewAddress, GuardianList } from "./guardian-list";
import { Modal } from "./modal";
import { Button } from "./ui/button";
import GuardiansStep from "./protect-account-steps/guardians";
import ThresholdStep from "./protect-account-steps/threshold";
import ReviewStepSection from "./protect-account-steps/review";
import { useToast } from "@/hooks/use-toast";
import ParametersSection from "./parameters-section";
import { useAddGuardians } from "@/hooks/use-add-guardians";
import { Address } from "viem";
import {
  getGuardianNickname,
  getStoredGuardians,
  storeGuardians,
} from "@/utils/storage";
import { useAccount } from "wagmi";
import LoadingModal from "./loading-modal";
import { useSrmData } from "@/hooks/use-srm-data";
import Link from "next/link";
import { getEtherscanAddressLink } from "@/utils/get-etherscan-link";

const buttonStyles = "rounded-xl font-roboto-mono h-7 font-bold text-xs";
const totalSteps = 3;

interface GuardiansContentProps {
  threshold: number;
  delayPeriod: number;
  onThresholdChange: (threshold: number) => void;
  onDelayPeriodChange: (delayPeriod: number) => void;
  resetQueries: () => void;
}

export default function GuardiansContent({
  threshold,
  delayPeriod,
  onThresholdChange,
  onDelayPeriodChange,
  resetQueries,
}: GuardiansContentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [guardians, setGuardians] = useState<NewAddress[]>([]);
  const [currentStep, setCurrentStep] = useState(1);

  const {
    guardians: guardiansWithoutNicknames,
    threshold: guardiansThreshold,
  } = useSrmData();

  const { address, chainId } = useAccount();

  const storedGuardians =
    chainId && address
      ? getStoredGuardians(chainId, address.toLowerCase() as Address)
      : undefined;

  const currentGuardians =
    guardiansWithoutNicknames &&
    guardiansWithoutNicknames.map((guardian, idx) => ({
      nickname:
        getGuardianNickname(guardian as Address, storedGuardians) ??
        `Guardian ${idx + 1}`,
      address: guardian,
    }));

  const { toast } = useToast();

  const onSuccess = () => {
    resetQueries();
    if (chainId && address)
      storeGuardians(
        [...(currentGuardians ?? []), ...guardians],
        chainId,
        address
      );
    toast({
      title: "Guardian added.",
      description:
        "Your new guardian will now be part of your account recovery setup.",
    });
    setIsOpen(false);
  };

  const {
    trigger: addGuardians,
    isLoading,
    loadingMessage,
    cancel,
  } = useAddGuardians({
    guardians: guardians.map((guardian) => guardian.address) as Address[],
    threshold,
    onSuccess,
  });

  const handleOnOpenGuardianModal = () => {
    setIsOpen(true);
  };

  const handleAddGuardian = (newGuardian: NewAddress): void => {
    setGuardians((prev) => [...prev, newGuardian]);
  };

  const handleRemoveGuardian = (index: number): void => {
    setGuardians((prev) => prev.filter((_, i) => i !== index));
  };

  const handleExternalLink = (address: string): void => {
    if (window && chainId) {
      window.open(getEtherscanAddressLink(Number(chainId), address));
    }
  };

  const handleNext = () => {
    if (!currentGuardians) return;
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      addGuardians();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleThresholdChange = (value: number) => {
    onThresholdChange(value);
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <GuardiansStep
            guardians={guardians}
            onAddGuardian={handleAddGuardian}
            onRemoveGuardian={handleRemoveGuardian}
            onExternalLink={handleExternalLink}
          />
        );
      case 2:
        return (
          <>
            {currentGuardians && (
              <ThresholdStep
                totalGuardians={currentGuardians.length + guardians.length}
                currentThreshold={threshold}
                onThresholdChange={handleThresholdChange}
                isNewThreshold
              />
            )}
          </>
        );
      case 3:
        return (
          <div className="space-y-5">
            <>
              <span className="text-lg font-bold font-roboto-mono opacity-60">
                New NewAddress
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
              <ReviewStepSection threshold={threshold} />
            </>
          </div>
        );
      default:
        return "";
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Add Guardian";
      case 2:
        return "Define New Threshold";
      case 3:
        return "Review and Confirm Addition";
      default:
        return "";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "You’re about to add a new guardian to your account recovery setup. This guardian will be able to help recover your account in case of credential loss.";
      case 2:
        return "Set a new threshold for recover approvals. The threshold determines how many guardians are required to approve recover actions.";
      default:
        return "";
    }
  };

  return (
    <div className="col-span-2">
      <div className="p-6 bg-content-background shadow-lg rounded-xl">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold font-roboto-mono text-primary ">
            Account Guardians
          </h3>
          {currentGuardians && currentGuardians.length > 0 && (
            <Button
              className={buttonStyles}
              onClick={handleOnOpenGuardianModal}
            >
              Add Guardian
            </Button>
          )}
        </div>
        {currentGuardians && currentGuardians.length > 0 ? (
          <GuardianList
            guardians={currentGuardians}
            isNewGuardianList
            onOpenGuardianModal={handleOnOpenGuardianModal}
            resetQueries={resetQueries}
          />
        ) : (
          <EmptyGuardians />
        )}
        {guardiansThreshold && currentGuardians ? (
          <ParametersSection
            guardians={currentGuardians}
            delayPeriod={delayPeriod}
            threshold={guardiansThreshold}
            onDelayPeriodChange={onDelayPeriodChange}
            onThresholdChange={onThresholdChange}
          />
        ) : undefined}
      </div>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={getStepTitle()}
        description={getStepDescription()}
        currentStep={currentStep}
        totalSteps={totalSteps}
        isProgress
        onNext={handleNext}
        onBack={handleBack}
        nextLabel={
          currentStep === 2
            ? "Finish and review"
            : currentStep === 3
            ? "Add Guardian"
            : "Next"
        }
        isNextDisabled={
          (currentStep === 1 && guardians.length === 0) ||
          (currentStep === 3 && isLoading)
        }
      >
        {getStepContent()}
      </Modal>
      <LoadingModal
        loading={isLoading}
        loadingText={loadingMessage}
        onCancel={cancel}
      />
    </div>
  );
}

function EmptyGuardians() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-sm font-roboto-mono text-center text-content-foreground">
      <span className="opacity-60 font-bold">No Guardians added.</span>
      <p className="mt-1 mb-5 max-w-xs opacity-60">
        Start protecting your account by adding trusted guardians.
      </p>
      <Link href="/protect-account">
        <Button className={buttonStyles}>Add Guardian</Button>
      </Link>
    </div>
  );
}
