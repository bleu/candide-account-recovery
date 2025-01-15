import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DelayPeriodStepProps {
  delayPeriod: number;
  onDelayPeriodChange: (value: number) => void;
}

export default function DelayPeriodStep({
  delayPeriod,
  onDelayPeriodChange,
}: DelayPeriodStepProps) {
  return (
    <Select
      value={delayPeriod.toString()}
      onValueChange={(value) => onDelayPeriodChange(parseInt(value))}
    >
      <SelectTrigger className="w-40 border-none focus:ring-primary text-foreground">
        <SelectValue placeholder="3 days" />
      </SelectTrigger>
      <SelectContent className="bg-background border-none">
        <SelectGroup>
          <SelectItem className="hover:bg-content-background" value="3">
            3 days
          </SelectItem>
          <SelectItem className="hover:bg-content-background" value="7">
            7 days
          </SelectItem>
          <SelectItem className="hover:bg-content-background" value="14">
            14 days
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
