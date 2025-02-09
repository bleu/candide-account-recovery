"use client";

import { useAccount } from "wagmi";
import {
  useBaseTransaction,
  type Transaction,
  type BaseTransactionResult,
} from "./useBaseTransaction";
import { useSafeDetection } from "./useSafeDetection";

export type SafeTransactionState =
  | "idle"
  | "preparing" // Creating transaction data
  | "proposingToSafe" // Proposing transaction to Safe UI
  | "awaitingConfirmations" // Waiting for other signers
  | "executing" // Transaction being executed
  | "success" // Transaction successful
  | "reverted" // Transaction reverted
  | "failed";

export type SafeTransactionResult = BaseTransactionResult<SafeTransactionState>;

/**
 * Hook for executing transactions through a Safe wallet
 * This should be used when the transaction needs to go through the Safe UI for multi-sig
 *
 * @param buildTransaction - Function to build the transaction
 * @returns Transaction execution result specific to Safe wallets
 */
export function useSafeTransaction(
  buildTransaction: () => Promise<Transaction | Transaction[]>
): SafeTransactionResult {
  const { address: signer } = useAccount();
  const { isSafeWallet } = useSafeDetection();

  return useBaseTransaction<SafeTransactionState>(buildTransaction, {
    initialState: "idle",
    onStateChange: (state) => {
      console.log("Safe transaction state changed:", state);
    },
    validateWallet: async () => {
      if (!isSafeWallet) {
        return false;
      }
      return true;
    },
    transformTransaction: async (tx) => {
      // When using WalletConnect with Safe, we need to send the transaction
      // with the exact format the Safe expects
      console.log("Transforming Safe transaction:", {
        to: tx.to,
        data: tx.data,
        value: tx.value?.toString(),
        from: signer,
      });
      return tx;
    },
  });
}
