import { STYLES } from "@/constants/styles";
import RecoveryStatus from "./recovery-status";
import { ExternalLink } from "lucide-react";
import { RecoveryLinkSection } from "./recovery-link-section";
import PressableIcon from "./pressable-icon";
import { Button } from "./ui/button";
import { Modal } from "./modal";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import LoadingModal from "./loading-modal";
import { Address } from "viem";
import { truncateAddress } from "@/utils/truncate-address";
import { ApprovalsInfo } from "@/hooks/useApprovalsInfo";
import { RecoveryInfo } from "@/hooks/useOngoingRecoveryInfo";
import { formatRemainingTime } from "@/utils/format-remaining-time";
import { useAccount } from "wagmi";
import { useCancelRecovery } from "@/hooks/useCancelRecovery";

interface RecoverySideBarProps {
  hasActiveRecovery: boolean;
  recoveryLink: string;
  safeAddress: Address | undefined;
  approvalsInfo: ApprovalsInfo | undefined;
  recoveryInfo: RecoveryInfo | undefined;
}

export default function RecoverySidebar({
  hasActiveRecovery,
  recoveryLink,
  safeAddress,
  approvalsInfo,
  recoveryInfo,
}: RecoverySideBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { address } = useAccount();

  const { toast } = useToast();

  const { executeAfter } = recoveryInfo ?? {};

  const { totalGuardianApprovals, guardiansThreshold } = approvalsInfo ?? {};

  const thresholdAchieved = Boolean(
    totalGuardianApprovals &&
      guardiansThreshold &&
      totalGuardianApprovals >= guardiansThreshold
  );
  const delayPeriodStarted = executeAfter
    ? executeAfter !== 0 && Date.now() < executeAfter
    : false;
  const delayPeriodEnded = executeAfter
    ? executeAfter !== 0 && Date.now() >= executeAfter
    : false;
  const remainingTime = executeAfter ? formatRemainingTime(executeAfter) : "";

  const { txHash, cancelRecovery, error, isLoading } = useCancelRecovery();

  useEffect(() => {
    if (error) {
      toast({
        title: "Error canceling recovery.",
        description: error,
        isWarning: true,
      });
    }
  }, [error, toast]);

  useEffect(() => {
    if (txHash) {
      toast({
        title: "Recovery Request canceled.",
        description:
          "All approvals have been revoked, and the process is now terminated.",
      });
    }
  }, [txHash, toast]);

  return (
    <div className="col-span-1">
      {hasActiveRecovery && (
        <RecoveryStatus
          delayPeriodEnded={delayPeriodEnded}
          thresholdAchieved={thresholdAchieved}
          delayPeriodStarted={delayPeriodStarted}
          remainingTime={remainingTime}
        />
      )}
      <h3 className="mb-2 font-bold text-sm font-roboto-mono">SAFE ACCOUNT</h3>
      <div
        style={STYLES.textWithBorderOpacity}
        className="flex items-center gap-3 opacity-60 border-b border-opacity-30 pb-2 mb-6"
      >
        <p className="text-2xl font-roboto-mono">
          {truncateAddress(safeAddress)}
        </p>
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
            disabled={address !== safeAddress}
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
        onNext={cancelRecovery}
        title="Cancel Recovery Request?"
        description="By canceling this recovery request, the process will be stopped immediately. Guardians will no longer be able to approve it, and the request cannot be executed. Are you sure you want to cancel?"
      />
      <LoadingModal loading={isLoading} loadingText="Canceling recovery..." />
    </div>
  );
}
