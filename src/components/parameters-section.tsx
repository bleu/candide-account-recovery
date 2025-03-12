import { STYLES } from "@/constants/styles";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Modal } from "./modal";
import ThresholdStep from "./protect-account-steps/threshold";
import DelayPeriodStep from "./protect-account-steps/delay-period";
import { NewAddress } from "./guardian-list";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useUpdateParameters } from "@/hooks/use-update-parameters";
import LoadingModal from "./loading-modal";
import { useSrmData } from "@/hooks/useSrmData";
import {
  SrmAddress,
  useSocialRecoveryModule,
} from "@/hooks/use-social-recovery-module";
import { SocialRecoveryModuleGracePeriodSelector } from "abstractionkit";

export const delayPeriodMap: Record<SrmAddress, number> = {
  [SocialRecoveryModuleGracePeriodSelector.After3Minutes]: 1,
  [SocialRecoveryModuleGracePeriodSelector.After3Days]: 3,
  [SocialRecoveryModuleGracePeriodSelector.After7Days]: 7,
  [SocialRecoveryModuleGracePeriodSelector.After14Days]: 14,
};

export const delayPeriodValueMap: Record<number, string> = {
  [1]: "3-minute",
  [3]: "3-day",
  [7]: "7-day",
  [14]: "14-day",
};

const totalSteps = 2;

interface ParametersSectionProps {
  guardians: NewAddress[];
  threshold: number;
  delayPeriod: number;
  onThresholdChange: (threshold: number) => void;
  onDelayPeriodChange: (delayPeriod: number) => void;
}

export default function ParametersSection({
  guardians,
  threshold,
  delayPeriod,
  onThresholdChange,
  onDelayPeriodChange,
}: ParametersSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [tempThreshold, setTempThreshold] = useState(threshold);
  const [tempDelayPeriod, setTempDelayPeriod] = useState(delayPeriod);
  const [error, setError] = useState("");

  const { threshold: currentThreshold } = useSrmData();
  const { srm } = useSocialRecoveryModule();
  const currentDelayPeriod =
    srm && delayPeriodMap[srm.moduleAddress as SrmAddress];

  const parametersChanged =
    tempDelayPeriod !== currentDelayPeriod ||
    tempThreshold !== currentThreshold;

  const { toast } = useToast();

  const onSuccess = () => {
    onThresholdChange(tempThreshold);
    onDelayPeriodChange(tempDelayPeriod);

    toast({
      title: "Parameters updated",
      description: "Your recovery parameters have been successfully updated.",
    });

    setIsOpen(false);
    setCurrentStep(1);
    setError("");
  };

  const { trigger, isLoading, loadingMessage, cancel } = useUpdateParameters({
    threshold: tempThreshold,
    delayPeriod: tempDelayPeriod,
    onSuccess,
  });

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
      return;
    }
    if (!parametersChanged) {
      setError("Please, change at least one of the parameters to continue.");
      return;
    }
    trigger();
  };

  const handleBack = () => {
    setError("");
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleModalClose = () => {
    setTempThreshold(threshold);
    setTempDelayPeriod(delayPeriod);
    setCurrentStep(1);
    setIsOpen(false);
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ThresholdStep
            totalGuardians={guardians.length}
            currentThreshold={tempThreshold}
            onThresholdChange={setTempThreshold}
          />
        );
      case 2:
        return (
          <>
            <DelayPeriodStep
              delayPeriod={tempDelayPeriod}
              onDelayPeriodChange={setTempDelayPeriod}
            />
            {error && (
              <p className={cn(STYLES.textError, "text-sm mt-5")}>{error}</p>
            )}
          </>
        );

      default:
        return "";
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8 mt-12">
        <h3 className="text-lg font-bold font-roboto-mono text-primary">
          Recovery Parameters
        </h3>
        <Button
          className="rounded-xl font-roboto-mono h-7 text-xs"
          onClick={() => setIsOpen(true)}
        >
          Update Parameters
        </Button>
      </div>
      <div className="flex gap-4 my-6">
        <div className="flex flex-col gap-1">
          <p className={STYLES.label}>DELAY PERIOD</p>
          <span
            style={STYLES.textWithBorderOpacity}
            className={STYLES.textWithBorder}
          >
            {delayPeriodValueMap[delayPeriod]}-day period.
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <p className={STYLES.label}>THRESHOLD</p>
          <span
            style={STYLES.textWithBorderOpacity}
            className={STYLES.textWithBorder}
          >
            {threshold} of {guardians.length} Guardians
          </span>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={handleModalClose}
        title={
          currentStep === 1
            ? "Set the new Approval Threshold"
            : "Set the new Recovery Delay Period"
        }
        description={
          currentStep === 1
            ? "Threshold determines the minimum number of guardian approvals required to recover your account."
            : "Set the time period during which you can cancel a initiated recovery request. We recommend a period of at least 3 days."
        }
        currentStep={currentStep}
        totalSteps={totalSteps}
        isProgress
        onNext={handleNext}
        onBack={handleBack}
        nextLabel={currentStep === 2 ? "Update parameters" : "Next"}
      >
        {getStepContent()}
      </Modal>
      <LoadingModal
        loading={isLoading}
        loadingText={loadingMessage}
        onCancel={cancel}
      />
    </>
  );
}
