import { ExternalLink, Minus } from "lucide-react";
import { NewAddress } from "./guardian-list";
import PressableIcon from "./pressable-icon";
import { Button } from "./ui/button";
import Link from "next/link";
import { getEtherscanAddressLink } from "@/utils/get-etherscan-link";

interface GuardianRowProps {
  guardian: NewAddress;
  isNewGuardianList?: boolean;
  onRemoveGuardian: (guardian: NewAddress) => void;
  chainId?: number;
}

export function GuardianRow({
  guardian,
  isNewGuardianList,
  onRemoveGuardian,
  chainId,
}: GuardianRowProps) {
  return (
    <div className="grid grid-cols-[1fr,3fr,1fr] items-center py-2 px-3 bg-background rounded-lg">
      <div className="text-xs text-foreground opacity-60 font-medium font-roboto-mono">
        {guardian.nickname}
      </div>
      <div className="flex items-center gap-2">
        <code className="text-xs text-foreground opacity-6g0 font-medium font-roboto-mono">
          {guardian.address}
        </code>
        <Link
          href={getEtherscanAddressLink(chainId ?? 1, guardian.address)}
          target="_blank"
        >
          <PressableIcon
            icon={ExternalLink}
            onClick={() => {}}
            size={14}
            className="opacity-60 hover:opacity-100"
          />
        </Link>
      </div>
      <div className="flex justify-end">
        {isNewGuardianList ? (
          <Button
            variant="link"
            className="flex items-center gap-1"
            onClick={() => onRemoveGuardian(guardian)}
          >
            <span className="font-roboto-mono text-xs text-primary font-bold">
              Remove Guardian
            </span>
            <div
              className="flex items-center justify-center rounded-full w-4 h-4 gap-2"
              style={{ backgroundColor: "rgba(176, 238, 129, 0.1)" }}
            >
              <Minus className="text-primary w-3 " />
            </div>
          </Button>
        ) : (
          <span className="px-4 py-1 bg-terciary text-terciary-foreground rounded-md text-xs">
            {guardian.status}
          </span>
        )}
      </div>
    </div>
  );
}
