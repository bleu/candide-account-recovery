import { STYLES } from "@/constants/styles";

interface ReviewStepSectionProps {
  threshold: number;
  delayPeriod?: number;
}

const delayPeriodStringMap: Record<number, string> = {
  [1]: "3-minute",
  [3]: "3-day",
  [7]: "7-day",
  [14]: "14-day",
};

export default function ReviewStepSection({
  threshold,
  delayPeriod,
}: ReviewStepSectionProps) {
  return (
    <>
      <div className="border-t pt-5" style={STYLES.textWithBorderOpacity}>
        <span className="text-lg font-bold font-roboto-mono opacity-60 ">
          {delayPeriod ? "Threshold" : "New Threshold"}
        </span>
        <p className="text-base font-roboto-mono text-content-foreground mt-3">
          Minimum {threshold} Guardians approval to recovery.
        </p>
      </div>
      {delayPeriod && (
        <div className="border-t pt-5" style={STYLES.textWithBorderOpacity}>
          <span className="text-lg font-bold font-roboto-mono opacity-60 ">
            Delay Period
          </span>
          <p className="text-base font-roboto-mono text-content-foreground mt-3">
            {delayPeriodStringMap[delayPeriod]} period to cancel a recovery
            request.
          </p>
        </div>
      )}
    </>
  );
}
