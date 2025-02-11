import { STYLES } from "@/constants/styles";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Modal } from "./modal";
import ThresholdStep from "./protect-account-steps/threshold";
import DelayPeriodStep from "./protect-account-steps/delay-period";
import { NewAddress } from "./guardian-list";
import { useToast } from "@/hooks/use-toast";

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

  const { toast } = useToast();

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onThresholdChange(tempThreshold);
      onDelayPeriodChange(tempDelayPeriod);

      toast({
        title: "Parameters updated",
        description: "Your recovery parameters have been successfully updated.",
      });

      setIsOpen(false);
      setCurrentStep(1);
    }
  };

  const handleBack = () => {
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
            isNewThreshold
          />
        );
      case 2:
        return (
          <DelayPeriodStep
            delayPeriod={tempDelayPeriod}
            onDelayPeriodChange={setTempDelayPeriod}
          />
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
      <div className="flex gap-2 my-6">
        <div className="flex flex-col gap-1">
          <p className={STYLES.label}>DELAY PERIOD</p>
          <span
            style={STYLES.textWithBorderOpacity}
            className={STYLES.textWithBorder}
          >
            {delayPeriod}-day period.
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
        nextLabel={currentStep === 2 ? "Finish and review" : "Next"}
      >
        {getStepContent()}
      </Modal>
    </>
  );
}
