"use client";

import React, { useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Search, Loader2 } from "lucide-react";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";
import { useSearchStore } from "@/stores/useSearchStore";
import { useDebounce } from "@/hooks/use-debounce";

const SearchInput = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const { toast } = useToast();

  const { isLoading, searchValue, setSearchValue, handleSearch } =
    useSearchStore();

  const performSearch = useCallback(
    async (value: string) => {
      if (!value) return;

      try {
        await handleSearch(value);
      } catch {
        toast({
          title: "Search failed",
          description:
            "There was an error processing your search. Please try again.",
          variant: "destructive",
        });
      }
    },
    [handleSearch, toast]
  );

  const debouncedSearch = useDebounce(performSearch, 500);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchValue) return;
    await performSearch(searchValue);
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
          onChange={handleInputChange}
          disabled={isLoading}
        />
      </div>
    </form>
  );
};

export default SearchInput;
