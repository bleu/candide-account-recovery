"use client";

import { useConfirmRecovery } from "@/hooks/useConfirmRecovery";
import { Address } from "viem";
import { useState } from "react";

const recoveryParams = {
  safeAddress: "0xbd222DB64d5ceB755B037B087A57C2e452c8E07C" as Address,
  newOwners: [
    "0xa90914762709441d557De208bAcE1edB1A3968b2",
    "0x21F3d1B62f6F23fC8b1B6920a3b62915790A85D5",
  ] as Address[],
  newThreshold: 2,
};

export default function RecoveryInterface() {
  const { txHash, confirmRecovery, error, isLoading } =
    useConfirmRecovery(recoveryParams);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleRecovery = async () => {
    try {
      confirmRecovery();
      setShowSuccess(true);
    } catch (err) {
      console.error("Recovery execution failed:", err);
    }
  };

  return (
    <div className="space-y-4 p-4 max-w-md mx-auto">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Safe Recovery</h2>
        <p className="text-gray-600">
          Execute recovery to transfer ownership to new wallet addresses
        </p>
      </div>

      <div className="space-y-2">
        <div className="text-sm text-gray-600">
          <p>Safe Address:</p>
          <code className="bg-gray-100 p-1 rounded">
            {recoveryParams.safeAddress}
          </code>
        </div>

        <div className="text-sm text-gray-600">
          <p>New Owners:</p>
          {recoveryParams.newOwners.map((owner, index) => (
            <code key={index} className="block bg-gray-100 p-1 rounded mb-1">
              {owner}
            </code>
          ))}
        </div>

        <div className="text-sm text-gray-600">
          <p>New Threshold:</p>
          <code className="bg-gray-100 p-1 rounded">
            {recoveryParams.newThreshold}
          </code>
        </div>
      </div>

      {error && <span className="text-red-600">{error.message}</span>}

      {showSuccess && txHash && <span>Success! {txHash}</span>}

      <button
        onClick={handleRecovery}
        disabled={isLoading}
        className={`
          w-full px-4 py-2 rounded
          ${
            isLoading
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }
          text-white font-medium transition-colors
          flex items-center justify-center space-x-2
        `}
      >
        {isLoading ? (
          <>
            <span>Executing Recovery...</span>
          </>
        ) : (
          <span>Execute Recovery</span>
        )}
      </button>
    </div>
  );
}
