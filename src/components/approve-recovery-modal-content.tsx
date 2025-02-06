import React from "react";
import AddressSection from "./address-section";
import { Square, SquareCheckBig } from "lucide-react";
interface ApproveRecoveryModalContentProps {
  safeAccount: string;
  safeSigners: string[] | undefined;
  isChecked: boolean;
  isLastGuardianToConfirm: boolean;
  delayPeriod: number;
  handleCheckToggle: () => void;
}

export default function ApproveRecoveryModalContent({
  safeAccount,
  safeSigners,
  isChecked,
  isLastGuardianToConfirm,
  delayPeriod,
  handleCheckToggle,
}: ApproveRecoveryModalContentProps) {
  return (
    <div className="space-y-7">
      <AddressSection
        title="Safe Address"
        description="The address of the account that need to be recovered."
        addresses={[safeAccount]}
      />
      {safeSigners && (
        <AddressSection
          title="Safe Signers"
          description="The public address of the new Safe signers."
          addresses={safeSigners}
        />
      )}
      {isLastGuardianToConfirm && (
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={handleCheckToggle}
          role="checkbox"
          aria-checked={isChecked}
        >
          {isChecked ? (
            <SquareCheckBig size={16} className="text-primary" />
          ) : (
            <Square size={16} className="text-primary" />
          )}
          <span className="text-content-foreground font-roboto-mono text-sm">
            Start the {delayPeriod}-day delay period now.
          </span>
        </div>
      )}
    </div>
  );
}
