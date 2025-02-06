import React, { useEffect, useState } from "react";
import { STYLES } from "@/constants/styles";
import { GuardianList } from "./guardian-list";
import PressableIcon from "./pressable-icon";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import EmptyActiveRecovery from "./empty-active-recovery";
import { Button } from "./ui/button";
import { Modal } from "./modal";
import LoadingModal from "./loading-modal";
import ApproveRecoveryModalContent from "./approve-recovery-modal-content";
import { useToast } from "@/hooks/use-toast";
import RecoveryLinkInput from "./recovery-link-input";
import { Address } from "viem";
import { useAccount } from "wagmi";
import { useConfirmRecovery } from "@/hooks/useConfirmRecovery";
import { useExecuteRecovery } from "@/hooks/useExecuteRecovery";
import { ApprovalsInfo } from "@/hooks/useApprovalsInfo";
import { RecoveryInfo } from "@/hooks/useOngoingRecoveryInfo";

interface RecoveryContentProps {
  hasActiveRecovery: boolean;
  safeSigners: string[] | undefined;
  safeAddress: Address | undefined;
  newOwners: Address[] | undefined;
  newThreshold: number | undefined;
  delayPeriod: number;
  isLinkRequired: boolean;
  approvalsInfo: ApprovalsInfo | undefined;
  recoveryInfo: RecoveryInfo | undefined;
}

export default function RecoveryContent({
  hasActiveRecovery,
  safeSigners,
  safeAddress,
  newOwners,
  newThreshold,
  delayPeriod,
  isLinkRequired,
  approvalsInfo,
  recoveryInfo,
}: RecoveryContentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldExecute, setShouldExecute] = useState(false);
  const [linkError, setLinkError] = useState<string>("");
  const [linkValue, setLinkValue] = useState<string>("");

  const { toast } = useToast();

  const { address } = useAccount();

  const thresholdAchieved =
    approvalsInfo &&
    approvalsInfo.totalGuardianApprovals >= approvalsInfo.guardiansThreshold;

  const isUserPendingGuardian =
    address &&
    approvalsInfo &&
    approvalsInfo.pendingGuardians.includes(address);

  const isLastGuardianToConfirm =
    isUserPendingGuardian &&
    approvalsInfo.totalGuardianApprovals ===
      approvalsInfo.guardiansThreshold - 1;

  const { executeAfter } = recoveryInfo ?? {};

  const delayPeriodEnded = executeAfter
    ? executeAfter !== 0 && Date.now() >= executeAfter
    : false;

  const handleApproveRecovery = () => {
    setIsOpen(false);
    confirmRecovery();
    return;
  };

  const handleCheckToggle = () => {
    setShouldExecute((prev) => !prev);
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLinkValue(e.target.value);
    if (linkError) setLinkError("");
  };

  const {
    confirmRecovery,
    txHash: confirmTxHash,
    error: confirmError,
    isLoading: confirmIsLoading,
  } = useConfirmRecovery({
    safeAddress,
    newOwners,
    newThreshold,
    shouldExecute,
  });

  const {
    executeRecovery,
    txHash: executeTxHash,
    error: executeError,
    isLoading: executeIsLoading,
  } = useExecuteRecovery({
    safeAddress,
    newOwners,
    newThreshold,
  });

  useEffect(() => {
    if (confirmTxHash && !isLastGuardianToConfirm) {
      toast({
        title: "Recovery approved.",
        description:
          "Waiting for other guardians to approve before starting the delay period.",
      });
      return;
    }
    if (confirmTxHash && !shouldExecute) {
      toast({
        title: "Recovery approved.",
        description: "The threshold was achieved. Click to start delay period.",
      });
      return;
    }
    if (executeTxHash || (confirmTxHash && shouldExecute)) {
      toast({
        title: "Recovery executed.",
        description: "Delay Period has started.",
      });
    }
  }, [
    confirmTxHash,
    executeTxHash,
    shouldExecute,
    isLastGuardianToConfirm,
    toast,
  ]);

  useEffect(() => {
    if (confirmError || executeError) {
      toast({
        title: "Error executing transaction.",
        description: (confirmError ?? executeError)!.message,
        isWarning: true,
      });
    }
  }, [confirmError, executeError, toast]);

  return (
    <div className="col-span-2">
      <div className="p-6 bg-content-background shadow-lg rounded-xl">
        {!isLinkRequired ? (
          <>
            <h3 className="text-lg font-bold font-roboto-mono text-primary">
              Account Recovery
            </h3>
            <div className="flex gap-2 my-6">
              <div className="flex flex-col gap-1">
                <p className={STYLES.label}>DELAY PERIOD</p>
                <span
                  style={STYLES.textWithBorderOpacity}
                  className={STYLES.textWithBorder}
                >
                  {delayPeriod}-day period not started.
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <p className={STYLES.label}>THRESHOLD</p>
                <span
                  style={STYLES.textWithBorderOpacity}
                  className={STYLES.textWithBorder}
                >
                  {approvalsInfo?.guardiansThreshold} of{" "}
                  {approvalsInfo?.guardiansApprovals.length} Guardians
                </span>
              </div>
            </div>
            {hasActiveRecovery ? (
              <>
                <div className="flex-col gap-1 inline-flex">
                  <p className={STYLES.label}>SAFE SIGNERS</p>
                  {safeSigners &&
                    safeSigners.map((address) => (
                      <div
                        key={address}
                        className={cn(
                          STYLES.textWithBorder,
                          "inline-flex items-center gap-2"
                        )}
                        style={STYLES.textWithBorderOpacity}
                      >
                        <span>{address}</span>
                        <PressableIcon
                          icon={ExternalLink}
                          onClick={() => {}}
                          size={12}
                        />
                      </div>
                    ))}
                </div>
                <h4 className="my-6 text-primary font-roboto-mono text-sm">
                  GUARDIANS APPROVAL
                </h4>
                {approvalsInfo?.guardiansApprovals && (
                  <GuardianList guardians={approvalsInfo.guardiansApprovals} />
                )}
                <div className="flex justify-end mt-4 mb-2 gap-2">
                  {!delayPeriodEnded && (
                    <Button
                      className="text-xs font-bold px-3 py-2 rounded-xl"
                      disabled={!thresholdAchieved}
                      onClick={executeRecovery}
                    >
                      Start Delay Period
                    </Button>
                  )}

                  {delayPeriodEnded && (
                    <Button
                      className="text-xs font-bold px-3 py-2 rounded-xl"
                      onClick={() => {
                        //finalizeRecovery
                        console.log("finalize recovery");
                      }}
                    >
                      Finalize Recovery
                    </Button>
                  )}
                  <Button
                    className="text-xs font-bold px-3 py-2 rounded-xl"
                    onClick={() => setIsOpen(true)}
                    disabled={!isUserPendingGuardian}
                  >
                    Approve Recovery
                  </Button>
                </div>
                <span className="text-xs flex justify-end text-[10px] opacity-60">
                  {delayPeriodEnded
                    ? "Anyone can finalize the reocvery request."
                    : "Only pending Guardians can approve this recovery request."}
                </span>
                <Modal
                  title="Approve Recovery Request"
                  description="A recovery request has been started and your approval is required to proceed with the recovery. Review the details below and confirm if you approve."
                  currentStep={2}
                  isOpen={isOpen}
                  totalSteps={1}
                  onClose={() => setIsOpen(false)}
                  onNext={handleApproveRecovery}
                  onBack={() => setIsOpen(false)}
                  nextLabel="Sign and Approve"
                  backLabel="Cancel"
                >
                  {safeAddress && (
                    <ApproveRecoveryModalContent
                      handleCheckToggle={handleCheckToggle}
                      delayPeriod={3}
                      isChecked={shouldExecute}
                      safeAccount={safeAddress}
                      safeSigners={safeSigners}
                      isLastGuardianToConfirm={Boolean(isLastGuardianToConfirm)}
                    />
                  )}
                </Modal>
                <LoadingModal
                  loading={confirmIsLoading || executeIsLoading}
                  loadingText={"Waiting for the transaction signature..."}
                />
              </>
            ) : (
              <EmptyActiveRecovery />
            )}
          </>
        ) : (
          <RecoveryLinkInput
            linkValue={linkValue}
            linkError={linkError}
            onLinkChange={handleLinkChange}
          />
        )}
      </div>
    </div>
  );
}
