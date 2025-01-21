import React from "react";
import NewGuardianList from "../new-guardians-list";
import { ExternalLink } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { STYLES } from "@/constants/styles";
import { cn } from "@/lib/utils";
import { Guardian } from "../guardian-list";

interface RecoveryProps {
  guardians: Guardian[];
  safeAddress: string;
  onAdd: (guardian: Guardian) => void;
  onRemove: (index: number) => void;
  onExternalLink: (address: string) => void;
  onValidateAddress?: (address: string) => Promise<string | null>;
  onSafeAddressChange: (address: string) => void;
}
export default function Recovery({
  guardians,
  safeAddress,
  onAdd,
  onRemove,
  onExternalLink,
  onValidateAddress,
  onSafeAddressChange,
}: RecoveryProps) {
  return (
    <>
      <p className="font-roboto-mono font-bold text-base text-content-foreground">
        Safe Address
      </p>
      <p className="mt-3 mb-5 font-roboto-mono text-sm text-content-foreground opacity-60">
        The address of the account that need to be recovered.
      </p>
      <div className="flex items-center gap-2">
        <Input
          placeholder="Address..."
          className={cn(STYLES.input, "flex-1")}
          value={safeAddress}
          onChange={(e) => onSafeAddressChange(e.target.value)}
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-background group"
          onClick={() => safeAddress && onExternalLink(safeAddress)}
          type="button"
        >
          <ExternalLink
            size={16}
            className="opacity-50 group-hover:opacity-100"
          />
        </Button>
      </div>
      <p className="font-roboto-mono font-bold text-base text-content-foreground mt-7">
        Safe Signer
      </p>
      <p className="mt-3 mb-5 font-roboto-mono text-sm text-content-foreground opacity-60">
        The public address of the new Safe signer.
      </p>
      <NewGuardianList
        guardians={guardians}
        onAdd={onAdd}
        onRemove={onRemove}
        onExternalLink={onExternalLink}
      />
    </>
  );
}
