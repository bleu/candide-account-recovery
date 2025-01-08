"use client";
import React, { useRef, useState } from "react";

import { Button, Input } from "@bleu.builders/ui";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

const Header = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <header className="flex h-32 items-center justify-around gap-4 mx-8">
      <div className="flex flex-1 justify-center">
        <h1 className="text-primary font-bold text-lg font-roboto-mono text-center">
          Safe Account Recovery
        </h1>
      </div>
      <div
        className={cn(
          "flex flex-1 items-center bg-content-background px-2 rounded-lg shadow-lg hover:cursor-text",
          isFocused
            ? "ring-2 ring-terciary ring-offset-background ring-offset-2"
            : ""
        )}
        onClick={() => inputRef.current?.focus()}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <Search size={20} className="text-content-foreground opacity-60 mr-2" />
        <Input
          ref={inputRef}
          className="flex-1 border-none bg-content-background text-primary text-xs font-medium py-3 font-roboto-mono focus:ring-0 focus:ring-offset-0 "
          placeholder="Type address"
        />
      </div>
      <div className="flex flex-1 justify-center">
        <Button className="py-2 px-4 rounded-lg font-roboto-mono bg-primary text-primary-foreground hover:bg-terciary hover:text-primary">
          Connect wallet
        </Button>
      </div>
    </header>
  );
};
export default Header;
