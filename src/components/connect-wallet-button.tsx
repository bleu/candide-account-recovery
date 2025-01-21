"use client";

import { ConnectKitButton } from "connectkit";
import { Button } from "@/components/ui/button";

export const ConnectWalletButton = () => {
  return (
    <ConnectKitButton.Custom>
      {({ show, isConnected, address }) => (
        <Button onClick={show} type="button" className="py-2 px-4 rounded-lg">
          {isConnected
            ? `${address?.slice(0, 6)}...${address?.slice(-4)}`
            : "Connect Wallet"}
        </Button>
      )}
    </ConnectKitButton.Custom>
  );
};
