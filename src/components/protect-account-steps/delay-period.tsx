import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sepolia } from "viem/chains";
import { useAccount } from "wagmi";

interface DelayPeriodStepProps {
  delayPeriod: number;
  onDelayPeriodChange: (value: number) => void;
}

export default function DelayPeriodStep({
  delayPeriod,
  onDelayPeriodChange,
}: DelayPeriodStepProps) {
  const { chainId } = useAccount();
  return (
    <Select
      value={delayPeriod.toString()}
      onValueChange={(value) => onDelayPeriodChange(parseInt(value))}
      disabled={chainId === sepolia.id}
    >
      <SelectTrigger className="w-40 border-none focus:ring-primary text-foreground">
        <SelectValue
          placeholder={chainId === sepolia.id ? "3 minutes" : "3 days"}
        />
      </SelectTrigger>
      <SelectContent className="bg-background border-none">
        <SelectGroup>
          {chainId === sepolia.id && (
            <SelectItem className="hover:bg-content-background" value="1">
              3 minutes
            </SelectItem>
          )}
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
