"use client";

import React from "react";

import SearchInput from "./search-input";
import Link from "next/link";
import Button from "./ui/button";

const Header = () => {
  return (
    <header className="flex h-32 items-center justify-around gap-4 mx-8">
      <div className="flex flex-1 justify-center">
        <Link href="/">
          <h1 className="text-primary font-bold text-lg font-roboto-mono text-center">
            Safe Account Recovery
          </h1>
        </Link>
      </div>
      <SearchInput />
      <div className="flex flex-1 justify-center">
        <Button className="py-2 px-4 rounded-lg font-roboto-mono">
          Connect wallet
        </Button>
      </div>
    </header>
  );
};
export default Header;
