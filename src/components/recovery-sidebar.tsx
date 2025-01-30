import { STYLES } from "@/constants/styles";
import RecoveryStatus from "./recovery-status";
import { ExternalLink } from "lucide-react";
import { RecoveryLinkSection } from "./recovery-link-section";
import PressableIcon from "./pressable-icon";
import { Button } from "./ui/button";
import { Modal } from "./modal";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import LoadingModal from "./loading-modal";

interface RecoverySideBarProps {
  hasActiveRecovery: boolean;
  recoveryLink: string;
  safeAccount: string;
}

export default function RecoverySidebar({
  hasActiveRecovery,
  recoveryLink,
  safeAccount,
}: RecoverySideBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isWaitingTransaction, setIsWaitingTransaction] = useState(false);

  const { toast } = useToast();

  const thresholdAchieved = true;
  const delayPeriodStarted = true;
  const delayPeriodEnded = false;

  const handleCancelRecovery = () => {
    setIsOpen(false);
    setIsWaitingTransaction(true);
    setTimeout(() => {
      setIsWaitingTransaction(false);
      toast({
        title: "Recovery Request canceled.",
        description:
          "All approvals have been revoked, and the process is now terminated.",
      });
    }, 4000);
  };

  return (
    <div className="col-span-1">
      {hasActiveRecovery && (
        <RecoveryStatus
          delayPeriodEnded={delayPeriodEnded}
          thresholdAchieved={thresholdAchieved}
          delayPeriodStarted={delayPeriodStarted}
          remainingTime="2d 23h 59min"
        />
      )}
      <h3 className="mb-2 font-bold text-sm font-roboto-mono">SAFE ACCOUNT</h3>
      <div
        style={STYLES.textWithBorderOpacity}
        className="flex items-center gap-3 opacity-60 border-b border-opacity-30 pb-2 mb-6"
      >
        <p className="text-2xl font-roboto-mono">{safeAccount}</p>
        <PressableIcon icon={ExternalLink} onClick={() => {}} size={18} />
      </div>
      {hasActiveRecovery && (
        <>
          <RecoveryLinkSection link={recoveryLink} />
          <h4 className="text-xs font-medium font-roboto-mono">
            Cancel Request
          </h4>
          <p className="text-xs font-medium opacity-60 my-2">
            Account owners can cancel this request at any time.
          </p>
          <Button
            className="font-bold text-xs rounded-xl"
            onClick={() => setIsOpen(true)}
          >
            Cancel
          </Button>
        </>
      )}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        currentStep={1}
        totalSteps={1}
        nextLabel="Cancel Request"
        onNext={handleCancelRecovery}
        title="Cancel Recovery Request?"
        description="By canceling this recovery request, the process will be stopped immediately. Guardians will no longer be able to approve it, and the request cannot be executed. Are you sure you want to cancel?"
      />
      <LoadingModal
        loading={isWaitingTransaction}
        setIsloading={setIsWaitingTransaction}
        loadingText="Canceling recovery..."
      />
    </div>
  );
}
