import React from "react";

import SearchInput from "./search-input";
import Link from "next/link";
import { ConnectWalletButton } from "./connect-wallet-button";

const Header = () => {
  return (
    <header className="flex h-32 items-center justify-between relative px-4 md:px-8">
      {/* Mobile View */}
      <div className="flex md:hidden w-full items-center justify-between">
        <Link href="/">
          <h1 className="text-primary font-bold text-base font-roboto-mono">
            Safe Account Recovery
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          <SearchInput />
          <ConnectWalletButton />
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex w-full items-center justify-around">
        <div className="flex-1 flex justify-center">
          <Link href="/">
            <h1 className="text-primary font-bold text-lg font-roboto-mono">
              Safe Account Recovery
            </h1>
          </Link>
        </div>
        <div className="flex-1 max-w-xl px-4">
          <SearchInput />
        </div>
        <div className="flex-1 flex justify-center">
          <ConnectWalletButton />
        </div>
      </div>
    </header>
  );
};
export default Header;
