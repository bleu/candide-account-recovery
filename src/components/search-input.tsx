"use client";

import React, { useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Search, Loader2 } from "lucide-react";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";
import { useSearchStore } from "@/stores/useSearchStore";
import { useDebounce } from "@/hooks/use-debounce";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const SearchInput = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const { isLoading, searchValue, setSearchValue, handleSearch } =
    useSearchStore();

  const performSearch = useCallback(
    async (value: string) => {
      if (!value) return;

      try {
        await handleSearch(value);
        setIsOpen(false); // Close popover after successful search
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

  const SearchForm = () => (
    <form onSubmit={onSubmit} className="w-full">
      <div
        className={cn(
          "flex w-full items-center bg-content-background px-2 py-1 rounded-lg shadow-lg hover:cursor-text min-h-[48px]",
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
            size={18}
            className="text-content-foreground opacity-60 mr-2 animate-spin flex-shrink-0"
          />
        ) : (
          <Search
            size={18}
            className="text-content-foreground opacity-60 mr-2 group-hover:opacity-100 flex-shrink-0"
          />
        )}
        <Input
          ref={inputRef}
          className="w-full border-none bg-content-background text-primary text-sm font-medium py-2 font-roboto-mono focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus:placeholder:text-primary focus-visible:ring-offset-0"
          placeholder="Type address or recovery link"
          value={searchValue}
          onChange={handleInputChange}
          disabled={isLoading}
        />
      </div>
    </form>
  );

  return (
    <>
      {/* Mobile View */}
      <div className="md:hidden">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <button
              className="rounded-full p-2 hover:bg-content-background transition-colors"
              aria-label="Search accounts"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin text-primary" />
              ) : (
                <Search size={20} className="text-primary" />
              )}
            </button>
          </PopoverTrigger>

          <PopoverContent
            className="w-screen max-w-[min(calc(100vw-32px),480px)] p-2"
            align="center"
            sideOffset={8}
          >
            <SearchForm />
          </PopoverContent>
        </Popover>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block w-full">
        <SearchForm />
      </div>
    </>
  );
};

export default SearchInput;
