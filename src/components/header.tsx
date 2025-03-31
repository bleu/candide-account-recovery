import React from "react";

import SearchInput from "./search-input";
import Link from "next/link";
import { ConnectWalletButton } from "./connect-wallet-button";

const Header = () => {
  return (
    <header className="flex h-32 items-center justify-around gap-4 mx-8">
      <div className="flex flex-1 justify-center">
        <Link href="/">
          <h1 className="text-primary font-bold text-lg font-roboto-mono text-center">
            Safe Cover
          </h1>
        </Link>
      </div>
      <SearchInput />
      <div className="flex flex-1 justify-center">
        <ConnectWalletButton />
      </div>
    </header>
  );
};
export default Header;
