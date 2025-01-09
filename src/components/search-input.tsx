import React from "react";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@bleu.builders/ui";

const SearchInput = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  return (
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
        className="flex-1 border-none bg-content-background text-primary text-xs font-medium py-3 font-roboto-mono focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus:placeholder:text-primary"
        placeholder="Type address"
      />
    </div>
  );
};

export default SearchInput;
