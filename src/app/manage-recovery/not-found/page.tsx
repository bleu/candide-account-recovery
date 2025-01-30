import { TextSearch } from "lucide-react";
import React from "react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 mb-32 max-w-md mx-auto">
      <TextSearch size={100} className="text-foreground opacity-30" />
      <h2 className="text-sm text-primary font-bold font-roboto-mono text-center my-3">
        Sorry, no results were found.
      </h2>
      <p className="text-xs font-roboto-mono text-center text-foreground opacity-60">
        Ensure that the address you are searching for is a Safe Account and is
        deployed on your selected network. Please, verify the account address or
        recovery link and try again.
      </p>
    </div>
  );
}
