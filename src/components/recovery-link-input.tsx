import React from "react";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { STYLES } from "@/constants/styles";
import { redirect } from "next/navigation";

interface RecoveryLinkInputProps {
  linkValue: string;
  linkError: string;
  onLinkChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function RecoveryLinkInput({
  linkValue,
  linkError,
  onLinkChange,
}: RecoveryLinkInputProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center self-center my-12 max-w-xs mx-auto">
      <span className="text-sm font-bold text-primary font-roboto-mono">
        Recovery Link Required
      </span>
      <p className="text-xs opacity-60 font-roboto-mono mt-1 mb-5">
        Recovery processes can only be accessed with their unique tracking
        links. Enter the link for the recovery you want to view.
      </p>
      <div className="flex items-center gap-2 w-full">
        <Input
          className="border rounded-sm text-xs bg-content-background font-medium font-roboto-mono opacity-60 h-6"
          value={linkValue}
          onChange={onLinkChange}
          placeholder="http://"
        />
        <Button className="text-xs h-6" onClick={() => redirect(linkValue)}>
          Enter
        </Button>
      </div>
      {linkError && (
        <p className={cn(STYLES.textError, "text-xs mt-2 self-start")}>
          {linkError}
        </p>
      )}
    </div>
  );
}
