import { Info } from "lucide-react";

interface RecoveryStatusProps {
  delayPeriodEnded: boolean;
  thresholdAchieved: boolean;
  delayPeriodStarted: boolean;
  remainingTime: string;
}

export default function RecoveryStatus({
  delayPeriodEnded,
  thresholdAchieved,
  delayPeriodStarted,
  remainingTime,
}: RecoveryStatusProps) {
  const getStatusMessage = () => {
    if (delayPeriodEnded) {
      return "Delay Period has ended. Recovery can be finalized.";
    }

    if (thresholdAchieved) {
      if (delayPeriodStarted) {
        return (
          <>
            Delay Period started.{" "}
            <span className="text-alert">Ends in {remainingTime}</span>
          </>
        );
      }
      return "Threshold achieved. Delay period not started.";
    }

    return "Delay period not started.";
  };

  return (
    <div className="flex items-center justify-between gap-2 flex-1 bg-terciary text-terciary-foreground text-xs font-roboto-mono rounded-lg py-2 px-4 mb-6">
      <div>
        <p className="font-bold mb-1">Recovery Ongoing</p>
        <p className="font-medium">{getStatusMessage()}</p>
      </div>
      <Info size={21} />
    </div>
  );
}
