"use client";

import {
  useBaseTransaction,
  type Transaction,
  type BaseTransactionResult,
} from "./useBaseTransaction";

export type EoaTransactionState =
  | "idle"
  | "preparing" // Creating transaction data
  | "awaitingSignature" // Waiting for user to sign
  | "executing" // Transaction being executed
  | "success" // Transaction successful
  | "reverted" // Transaction reverted
  | "failed";

export type EoaTransactionResult = BaseTransactionResult<EoaTransactionState>;

/**
 * Hook for executing transactions through an EOA wallet
 * This should be used when the transaction should be executed directly (not through a Safe)
 *
 * @param buildTransaction - Function to build the transaction
 * @returns Transaction execution result specific to EOA wallets
 */
export function useEoaTransaction(
  buildTransaction: () => Promise<Transaction | Transaction[]>
): EoaTransactionResult {
  return useBaseTransaction<EoaTransactionState>(buildTransaction, {
    initialState: "idle",
    onStateChange: (state) => {
      // State transitions are handled by the base hook
      console.log("EOA transaction state changed:", state);
    },
  });
}
