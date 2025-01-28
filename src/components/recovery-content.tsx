import React, { useState } from "react";
import { STYLES } from "@/constants/styles";
import { Guardian, GuardianList } from "./guardian-list";
import PressableIcon from "./pressable-icon";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import EmptyActiveRecovery from "./empty-active-recovery";
import { Button } from "./ui/button";
import { Modal } from "./modal";
import LoadingModal from "./loading-modal";
import ApproveRecoveryModalContent from "./approve-recovery-modal-content";

interface RecoveryContentProps {
  hasActiveRecovery: boolean;
  guardians: Guardian[];
  safeSigners: string[];
  safeAccount: string;
}

export default function RecoveryContent({
  hasActiveRecovery,
  guardians,
  safeSigners,
  safeAccount,
}: RecoveryContentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setIsloading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  // MOCKED LOADING  UNTIL INTEGRATION
  const handleApproveRecovery = () => {
    setIsOpen(false);
    setIsloading(true);
    setTimeout(() => {
      setIsloading(false);
    }, 4000);
  };

  const handleCheckToggle = () => {
    setIsChecked((prev) => !prev);
  };

  const thresholdAchieved = true;

  return (
    <div className="col-span-2">
      <div className="p-6 bg-content-background shadow-lg rounded-xl">
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
              3-day period not started.
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <p className={STYLES.label}>THRESHOLD</p>
            <span
              style={STYLES.textWithBorderOpacity}
              className={STYLES.textWithBorder}
            >
              2 of 2 Guardians
            </span>
          </div>
        </div>
        {hasActiveRecovery ? (
          <>
            <div className="flex-col gap-1 inline-flex">
              <p className={STYLES.label}>SAFE SIGNERS</p>
              {safeSigners.map((address) => (
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
            <GuardianList guardians={guardians} />
            <div className="flex justify-end mt-4 mb-2 gap-2">
              <Button className="text-xs font-bold px-3 py-2 rounded-xl">
                Start Delay Period
              </Button>
              <Button
                className="text-xs font-bold px-3 py-2 rounded-xl"
                onClick={() => setIsOpen(true)}
              >
                Approve Recovery
              </Button>
            </div>
            <span className="text-xs flex justify-end text-[10px] opacity-60">
              Only Guardians can approve this recovery request.
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
              <ApproveRecoveryModalContent
                handleCheckToggle={handleCheckToggle}
                delayPeriod={3}
                isChecked={isChecked}
                safeAccount={safeAccount}
                safeSigners={safeSigners}
                thresholdAchieved={thresholdAchieved}
              />
            </Modal>
            <LoadingModal loading={loading} setIsloading={setIsloading} />
          </>
        ) : (
          <EmptyActiveRecovery />
        )}
      </div>
    </div>
  );
}
