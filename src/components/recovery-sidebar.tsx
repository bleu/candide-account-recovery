import { STYLES } from "@/constants/styles";
import RecoveryStatus from "./recovery-status";
import { ExternalLink } from "lucide-react";
import { RecoveryLinkSection } from "./recovery-link-section";
import PressableIcon from "./pressable-icon";
import { Button } from "./ui/button";

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
  const thresholdAchieved = true;
  const delayPeriodStarted = true;
  const delayPeriodEnded = false;

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
          <Button className="font-bold text-xs rounded-xl">Cancel</Button>
        </>
      )}
    </div>
  );
}
