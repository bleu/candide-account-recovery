"use client";

import { useAddGuardians } from "@/hooks/useAddGuardians";

export default function Page() {
  const guardians = [
    "0x21F3d1B62f6F23fC8b1B6920a3b62915790A85D5",
  ] as `0x${string}`[];
  const threshold = 1;
  const { txHashes, addGuardians, error, isLoading } = useAddGuardians(
    guardians,
    threshold
  );

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <button
        onClick={() => {
          addGuardians();
        }}
        disabled={isLoading}
      >
        Add guardian
      </button>
      {isLoading && (
        <span>Please resolve signatures on your wallet manager...</span>
      )}
      {error && <span>{error}</span>}
      {txHashes.length > 0 && <span>Success! TxHashes: {txHashes}</span>}
    </div>
  );
}
