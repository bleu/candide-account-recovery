import React from "react";
import { Input } from "../ui/input";
import { STYLES } from "@/constants/styles";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Copy } from "lucide-react";

export default function ShareLink() {
  return (
    <>
      <p className="font-roboto-mono font-bold text-base text-content-foreground">
        Recovery link
      </p>
      <p className="mt-3 mb-5 font-roboto-mono text-sm text-content-foreground opacity-60">
        Copy the link to share with guardians or others involved in the
        recovery.
      </p>
      <div className="flex items-center gap-2">
        <Input
          placeholder="http://"
          className={cn(STYLES.input, "flex-1")}
          onChange={(e) => console.log(e.target.value)}
          readOnly
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-background group"
          onClick={() => console.log("test")}
          type="button"
        >
          <Copy size={16} className="opacity-50 group-hover:opacity-100" />
        </Button>
      </div>
    </>
  );
}
