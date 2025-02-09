"use client";

import { Address } from "viem";
import { useAccount } from "wagmi";
import { useSrmStore } from "@/stores/useSrmStore";
import { useTransactionExecution } from "./useTransactionExecution";
import { ok } from "@/utils/result";
import { buildFinalizeRecoveryTransaction } from "@/services/transactions";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import React from "react";

/**
 * Hook for finalizing a recovery operation
 *
 * @param safeAddress - The address of the safe to finalize recovery for
 * @returns Object containing:
 * - finalizeRecovery: Function to trigger the finalization
 * - txHash: Transaction hash if available
 * - error: Error message if any
 * - isLoading: Whether the transaction is in progress
 * - state: Current transaction state (EOA or Safe specific)
 */
export function useFinalizeRecovery(safeAddress: Address | undefined) {
  const { address: account } = useAccount();
  const { srm } = useSrmStore();
  const queryClient = useQueryClient();

  // Validation function that returns Result<true>
  const validate = () => {
    if (!safeAddress) return ok(false);
    return ok(true as const);
  };

  const { txHash, error, isLoading, mutation, state } = useTransactionExecution(
    async () => {
      if (!account) throw new Error("Wallet not connected");
      if (!safeAddress) throw new Error("Missing safe address");

      // Build transaction using our service
      const result = await buildFinalizeRecoveryTransaction(srm, safeAddress);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.value;
    }
  );

  // Invalidate queries after successful transaction
  React.useEffect(() => {
    if (state === "success" && account) {
      queryClient.invalidateQueries({
        queryKey: queryKeys.recoveryInfo(safeAddress),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.owners(safeAddress),
      });
    }
  }, [state, account, queryClient, safeAddress]);

  return {
    finalizeRecovery: () => {
      if (!validate().success) return;
      mutation.mutate();
    },
    txHash,
    error,
    isLoading,
    state,
  };
}
