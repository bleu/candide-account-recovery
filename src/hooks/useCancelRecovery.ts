"use client";

import { Address } from "viem";
import { useAccount } from "wagmi";
import { useSrmStore } from "@/stores/useSrmStore";
import { useTransactionExecution } from "./useTransactionExecution";
import { ok } from "@/utils/result";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import React from "react";

/**
 * Hook for canceling a recovery operation
 *
 * @returns Object containing:
 * - cancelRecovery: Function to trigger the cancellation
 * - txHash: Transaction hash if available
 * - error: Error message if any
 * - isLoading: Whether the transaction is in progress
 * - state: Current transaction state (EOA or Safe specific)
 */
export function useCancelRecovery() {
  const { address: account } = useAccount();
  const { srm } = useSrmStore();
  const queryClient = useQueryClient();

  // Validation function that returns Result<true>
  const validate = () => {
    if (!account) return ok(false);
    return ok(true as const);
  };

  const { txHash, error, isLoading, mutation, state } = useTransactionExecution(
    async () => {
      if (!account) throw new Error("Wallet not connected");

      // Build transaction using our service
      const tx = srm.createCancelRecoveryMetaTransaction();
      return {
        to: tx.to as Address,
        data: tx.data as `0x${string}`,
        value: BigInt(0),
      };
    }
  );

  // Invalidate queries after successful transaction
  React.useEffect(() => {
    if (state === "success" && account) {
      queryClient.invalidateQueries({
        queryKey: queryKeys.recoveryInfo(account),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.approvalsInfo({
          safeAddress: account,
        }),
      });
    }
  }, [state, account, queryClient]);

  return {
    cancelRecovery: () => {
      if (!validate().success) return;
      mutation.mutate();
    },
    txHash,
    error,
    isLoading,
    state,
  };
}
