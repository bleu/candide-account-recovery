import { cn } from "@/lib/utils";
import { GuardianRow } from "./guardian-row";
import { STYLES } from "@/constants/styles";
import { useState } from "react";
import { Modal } from "./modal";
import ThresholdStep from "./protect-account-steps/threshold";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ExternalLink } from "lucide-react";
import ReviewStepSection from "./protect-account-steps/review";

export interface Guardian {
  nickname: string;
  address: string;
  status?: string;
}

interface GuardianListProps {
  guardians: Guardian[];
  isNewGuardinList?: boolean;
  onRemoveGuardian?: (guardian: Guardian) => void;
}

const totalSteps = 3;

export function GuardianList({
  guardians,
  isNewGuardinList,
  onRemoveGuardian,
}: GuardianListProps) {
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [guardianToRemove, setGuardianToRemove] = useState<Guardian>();
  const [currentStep, setCurrentStep] = useState(1);
  const [threshold, setThreshold] = useState(1);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleConfirmRemove();
    }
  };

  const handleThresholdChange = (value: number) => {
    setThreshold(value);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleRemoveClick = (guardian: Guardian) => {
    setGuardianToRemove(guardian);
    setIsRemoveModalOpen(true);
  };

  const handleConfirmRemove = () => {
    if (guardianToRemove && onRemoveGuardian) {
      onRemoveGuardian(guardianToRemove);
    }
    setIsRemoveModalOpen(false);
    setGuardianToRemove({ nickname: "", address: "" });
    setCurrentStep(1);
  };

  const handleExternalLink = (address: string): void => {
    window.open(`https://etherscan.io/address/${address}`);
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-5">
            <GuardiansToBeRemoved
              nickname={guardianToRemove?.nickname || ""}
              address={guardianToRemove?.address || ""}
              onExternalLink={() =>
                guardianToRemove?.address &&
                handleExternalLink(guardianToRemove.address)
              }
            />
          </div>
        );

      case 2:
        return (
          <ThresholdStep
            totalGuardians={guardians.length}
            currentThreshold={threshold}
            onThresholdChange={handleThresholdChange}
            isNewThreshold
          />
        );
      case 3:
        return (
          <div className="space-y-5">
            <span className="text-lg font-bold font-roboto-mono opacity-60">
              Guardians to be removed
            </span>
            <div className="space-y-5">
              <GuardiansToBeRemoved
                nickname={guardianToRemove?.nickname || ""}
                address={guardianToRemove?.address || ""}
                onExternalLink={() =>
                  guardianToRemove?.address &&
                  handleExternalLink(guardianToRemove.address)
                }
              />
            </div>
            <ReviewStepSection threshold={threshold} />
          </div>
        );
      default:
        return "";
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Remove Guardian";
      case 2:
        return "Define New Threshold";
      case 3:
        return "Review and Confirm Removal";
      default:
        return "";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Removing a guardian will reduce the number of trusted accounts protecting your account. To proceed, you will need to adjust the threshold required for approvals.";
      case 2:
        return "Set a new threshold for recover approvals. The threshold determines how many guardians are required to approve recover actions.";
      default:
        return "";
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className={cn(STYLES.label, "grid grid-cols-[1fr,3fr,1fr] gap-4")}>
          <div>NICKNAME</div>
          <div>ADDRESS</div>
          {!isNewGuardinList && <div className="text-right mr-4">APPROVAL</div>}
        </div>
        <div className="space-y-2">
          {guardians.map((guardian) => (
            <GuardianRow
              key={guardian.nickname}
              guardian={guardian}
              isNewGuardinList={isNewGuardinList}
              onRemoveGuardian={() => handleRemoveClick(guardian)}
            />
          ))}
        </div>
      </div>
      <Modal
        isOpen={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
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
            ? "Confirm Removal"
            : "Next"
        }
      >
        {getStepContent()}
      </Modal>
    </>
  );
}

function GuardiansToBeRemoved({
  nickname,
  address,
  onExternalLink,
}: {
  nickname: string;
  address: string;
  onExternalLink: () => void;
}) {
  return (
    <>
      <div className="grid grid-cols-[1fr,2fr]">
        <div className="flex items-center">
          <label className="text-sm font-bold font-roboto-mono opacity-50">
            NICKNAME
          </label>
        </div>
        <label className="text-sm font-bold opacity-50 font-roboto-mono ml-2">
          ADDRESS
        </label>
      </div>
      <div className="grid grid-cols-[1fr,2fr] gap-2">
        <Input readOnly value={nickname} className={STYLES.input} />
        <div className="flex flex-1 gap-2">
          <Input
            readOnly
            value={address}
            className={cn(STYLES.input, "flex-1")}
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-background group"
            onClick={onExternalLink}
            type="button"
          >
            <ExternalLink
              size={16}
              className="opacity-50 group-hover:opacity-100"
            />
          </Button>
        </div>
      </div>
    </>
  );
}
