import React from "react";
import { STYLES } from "@/constants/styles";
import { Guardian, GuardianList } from "./guardian-list";
import PressableIcon from "./ui/pressable-icon";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "./ui/button";
import EmptyActiveRecovery from "./empty-active-recovery";

interface RecoveryContentProps {
  hasActiveRecovery: boolean;
  guardians: Guardian[];
}

export default function RecoveryContent({
  hasActiveRecovery,
  guardians,
}: RecoveryContentProps) {
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
            <p className={STYLES.label}>SAFE SIGNERS</p>
            {guardians.map((guardian) => (
              <div
                key={guardian.nickname}
                className={cn(
                  STYLES.textWithBorder,
                  "inline-flex items-center gap-2"
                )}
                style={STYLES.textWithBorderOpacity}
              >
                <span>{guardian.address}</span>
                <PressableIcon
                  icon={ExternalLink}
                  onClick={() => {}}
                  size={12}
                />
              </div>
            ))}
            <h4 className="my-6 text-primary font-roboto-mono text-sm">
              GUARDIANS APPROVAL
            </h4>
            <GuardianList guardians={guardians} />
            <div className="flex justify-end mt-4 mb-2 gap-2">
              <Button className="text-xs font-roboto-mono font-bold px-3 py-2 rounded-xl">
                Start Delay Period
              </Button>
              <Button className="text-xs font-roboto-mono font-bold px-3 py-2 rounded-xl">
                Approve Recovery
              </Button>
            </div>
            <span className="text-xs flex justify-end text-[10px] opacity-60">
              Only Guardians can approve this recovery request.
            </span>
          </>
        ) : (
          <EmptyActiveRecovery />
        )}
      </div>
    </div>
  );
}
