import { Input } from "../ui/input";

interface ThresholdStepProps {
  totalGuardians: number;
  isNewThreshold?: boolean;
  currentThreshold?: number;
  onThresholdChange: (value: number) => void;
}

export default function ThresholdStep({
  totalGuardians,
  isNewThreshold,
  currentThreshold,
  onThresholdChange,
}: ThresholdStepProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    const clampedValue = Math.min(Math.max(value, 1), totalGuardians);
    onThresholdChange(clampedValue);
  };

  return (
    <>
      <Input
        type="number"
        min={1}
        max={totalGuardians}
        defaultValue={currentThreshold || 1}
        className="w-40 border-none text-base focus:ring-primary"
        onChange={handleChange}
      />
      <p className="text-xs font-roboto-mono font-medium opacity-60 mt-2">
        {isNewThreshold
          ? `You will now have ${totalGuardians} guardians. Choose a threshold between 1 and ${totalGuardians}.`
          : `${totalGuardians} guardians added. Choose a threshold between 1 and
        ${totalGuardians}.`}
      </p>
    </>
  );
}
