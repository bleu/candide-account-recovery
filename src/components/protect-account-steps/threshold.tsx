import { Guardian } from "../guardian-list";
import { Input } from "../ui/input";

interface ThresholdStepProps {
  guardians: Guardian[];
  onThresholdChange: (value: number) => void;
}

export default function ThresholdStep({
  guardians,
  onThresholdChange,
}: ThresholdStepProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    const clampedValue = Math.min(Math.max(value, 1), guardians.length);
    onThresholdChange(clampedValue);
  };
  return (
    <>
      <Input
        type="number"
        min={1}
        max={guardians.length}
        defaultValue={1}
        className="w-40 border-none text-base focus:ring-primary"
        onChange={handleChange}
      />
      <p className="text-xs font-roboto-mono font-medium opacity-60 mt-2">
        {guardians.length} guardians added. Choose a threshold between 1 and{" "}
        {guardians.length}.
      </p>
    </>
  );
}
