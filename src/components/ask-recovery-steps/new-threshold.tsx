import { Input } from "../ui/input";

interface NewThresholdProps {
  totalOwners: number;
  isNewThreshold?: boolean;
  currentThreshold?: number;
  onThresholdChange: (value: number) => void;
}

export default function NewThreshold({
  totalOwners,
  isNewThreshold,
  currentThreshold,
  onThresholdChange,
}: NewThresholdProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    const clampedValue = Math.min(Math.max(value, 1), totalOwners);
    onThresholdChange(clampedValue);
  };

  return (
    <>
      <Input
        type="number"
        min={1}
        max={totalOwners}
        defaultValue={currentThreshold || 1}
        className="w-40 border-none text-base focus:ring-primary"
        onChange={handleChange}
      />
      <p className="text-xs font-roboto-mono font-medium opacity-60 mt-2">
        {isNewThreshold
          ? `You will now have ${totalOwners} owners. Choose a threshold between 1 and ${totalOwners}.`
          : `${totalOwners} owners added. Choose a threshold between 1 and
        ${totalOwners}.`}
      </p>
    </>
  );
}
