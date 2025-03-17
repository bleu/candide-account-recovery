"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Search, Loader2 } from "lucide-react";
import { Input } from "./ui/input";
import { useSearchStore } from "@/stores/useSearchStore";
import { ChainSelector } from "./chain-selector";

const SearchInput = () => {
  const [chainId, setChainId] = useState<string>("1");
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    console.log({ chainId });
  }, [chainId]);

  const { isLoading, searchValue, setSearchValue, handleSearch } =
    useSearchStore({ chainId: Number(chainId) });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchValue) return;
    handleSearch();
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-1">
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
        {isLoading ? (
          <Loader2
            size={20}
            className="text-content-foreground opacity-60 mr-2 animate-spin"
          />
        ) : (
          <Search
            size={20}
            className="text-content-foreground opacity-60 mr-2 group-hover:opacity-100"
          />
        )}
        <Input
          ref={inputRef}
          className="flex-1 border-none bg-content-background text-primary text-xs font-medium py-3 font-roboto-mono focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus:placeholder:text-primary focus-visible:ring-offset-0"
          placeholder="Type address or recovery link"
          value={searchValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchValue(e.target.value)
          }
          disabled={isLoading}
        />
        <ChainSelector chainId={chainId} setChainId={setChainId} />
      </div>
    </form>
  );
};

export default SearchInput;
