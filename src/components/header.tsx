"use client";

import React from "react";

import { Button, Input } from "@bleu.builders/ui";
import SearchInput from "./search-input";

const Header = () => {
  return (
    <header className="flex h-32 items-center justify-around gap-4 mx-8">
      <div className="flex flex-1 justify-center">
        <h1 className="text-primary font-bold text-lg font-roboto-mono text-center">
          Safe Account Recovery
        </h1>
      </div>
      <SearchInput />
      <div className="flex flex-1 justify-center">
        <Button className="py-2 px-4 rounded-lg font-roboto-mono bg-primary text-primary-foreground hover:bg-terciary hover:text-primary">
          Connect wallet
        </Button>
      </div>
    </header>
  );
};
export default Header;
