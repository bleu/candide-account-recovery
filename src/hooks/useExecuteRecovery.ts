"use client";

import { Address } from "viem";
import { useAccount } from "wagmi";
import { useSrmStore } from "@/stores/useSrmStore";
import { useTransactionExecution } from "./useTransactionExecution";
import { validateRecoveryParams } from "@/utils/validation";
import { ok } from "@/utils/result";
import { buildExecuteRecoveryTransaction } from "@/services/transactions";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import React from "react";

interface ExecuteRecoveryParams {
  /** The address of the safe to recover */
  safeAddress: Address | undefined;
  /** The new owners to set for the safe */
  newOwners: Address[] | undefined;
  /** The new threshold for the safe */
  newThreshold: number | undefined;
}

/**
 * Hook for executing a recovery operation on a safe
 *
 * @param params - The parameters for the recovery operation
 * @returns Object containing:
 * - executeRecovery: Function to trigger the recovery
 * - txHash: Transaction hash if available
 * - error: Error message if any
 * - isLoading: Whether the transaction is in progress
 * - state: Current transaction state (EOA or Safe specific)
 *
 * @example
 * ```tsx
 * const { executeRecovery, isLoading, error, state } = useExecuteRecovery({
 *   safeAddress: "0x...",
 *   newOwners: ["0x...", "0x..."],
 *   newThreshold: 2
 * });
 * ```
 */
export function useExecuteRecovery({
  safeAddress,
  newOwners,
  newThreshold,
}: ExecuteRecoveryParams) {
  const { address: account } = useAccount();
  const { srm } = useSrmStore();
  const queryClient = useQueryClient();

  // Validation function that returns Result<true>
  const validate = () => {
    const result = validateRecoveryParams(safeAddress, newOwners, newThreshold);
    if (!result.success) return result;
    return ok(true as const);
  };

  const { txHash, error, isLoading, mutation, state } = useTransactionExecution(
    async () => {
      if (!account) throw new Error("Wallet not connected");

      // Build transaction using our service
      const result = await buildExecuteRecoveryTransaction(
        srm,
        safeAddress as Address,
        newOwners as Address[],
        newThreshold as number
      );
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
        queryKey: queryKeys.approvalsInfo({
          safeAddress,
          newOwners,
          newThreshold,
        }),
      });
    }
  }, [state, account, queryClient, safeAddress, newOwners, newThreshold]);

  return {
    executeRecovery: () => {
      if (!validate().success) return;
      mutation.mutate();
    },
    txHash,
    error,
    isLoading,
    state,
  };
}
