import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const thresholdOptions = Array.from(
    { length: totalGuardians },
    (_, i) => i + 1
  );

  return (
    <>
      <Select
        value={(currentThreshold || 1).toString()}
        onValueChange={(value) => {
          onThresholdChange(parseInt(value));
        }}
      >
        <SelectTrigger className="w-40 border-none focus:ring-primary text-foreground">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-background border-none">
          <SelectGroup>
            {thresholdOptions.map((value) => (
              <SelectItem
                key={value}
                className="hover:bg-content-background hover:cursor-pointer"
                value={value.toString()}
              >
                {value}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <p className="text-xs font-roboto-mono font-medium opacity-60 mt-2">
        {isNewThreshold
          ? `You will now have ${totalGuardians} guardians. Choose a threshold between 1 and ${totalGuardians}.`
          : `${totalGuardians} guardians added. Choose a threshold between 1 and ${totalGuardians}.`}
      </p>
    </>
  );
}
