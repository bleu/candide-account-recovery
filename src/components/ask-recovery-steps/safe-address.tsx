import React from "react";
import { ExternalLink } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { STYLES } from "@/constants/styles";
import { cn } from "@/lib/utils";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useChains } from "wagmi";
import { ChainIcon } from "connectkit";

interface RecoveryProps {
  safeAddress: string;
  onExternalLink: (address: string) => void;
  onSafeAddressChange: (address: string) => void;
  error?: string;
  chainId: string;
  onChainIdChange: (value: string) => void;
}
export default function Recovery({
  safeAddress,
  onExternalLink,
  onSafeAddressChange,
  error,
  chainId,
  onChainIdChange,
}: RecoveryProps) {
  const chains = useChains();

  return (
    <>
      <p className="font-roboto-mono font-bold text-base text-content-foreground">
        Safe Address
      </p>
      <p className="mt-3 mb-5 font-roboto-mono text-sm text-content-foreground opacity-60">
        The address of the account that need to be recovered.
      </p>
      <div className="flex items-center gap-2 mb-2">
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
      {error && <p className={cn(STYLES.textError, "text-sm")}>{error}</p>}
      <div className="h-6"></div>
      <p className="font-roboto-mono font-bold text-base text-content-foreground">
        Safe Address Chain
      </p>
      <p className="mt-3 mb-5 font-roboto-mono text-sm text-content-foreground opacity-60">
        Select the chain where the safe address is deployed.
      </p>
      <Select
        value={chainId}
        onValueChange={(value) => {
          onChainIdChange(value);
        }}
      >
        <SelectTrigger className="w-40 border-none focus:ring-primary text-foreground">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-background border-none">
          <SelectGroup>
            {chains.map((chain) => (
              <SelectItem
                key={chain.id}
                className="hover:bg-content-background hover:cursor-pointer"
                value={chain.id.toString()}
              >
                <div className="flex gap-2 items-center">
                  <ChainIcon id={chain.id} size={24} />
                  {chain.name}
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
}
