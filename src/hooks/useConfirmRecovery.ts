"use client";

import { Address } from "viem";
import { useAccount } from "wagmi";
import { useSrmStore } from "@/stores/useSrmStore";
import { useTransactionExecution } from "./useTransactionExecution";
import { validateRecoveryParams } from "@/utils/validation";
import { ok } from "@/utils/result";
import { buildConfirmRecoveryTransaction } from "@/services/transactions";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import React from "react";

interface ConfirmRecoveryParams {
  safeAddress: Address | undefined;
  newOwners: Address[] | undefined;
  newThreshold: number | undefined;
  shouldExecute: boolean;
}

/**
 * Hook for confirming a recovery operation
 *
 * @param params - The parameters for confirming recovery
 * @returns Object containing:
 * - confirmRecovery: Function to trigger the confirmation
 * - txHash: Transaction hash if available
 * - error: Error message if any
 * - isLoading: Whether the transaction is in progress
 * - state: Current transaction state (EOA or Safe specific)
 */
export function useConfirmRecovery({
  safeAddress,
  newOwners,
  newThreshold,
  shouldExecute,
}: ConfirmRecoveryParams) {
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
      const result = await buildConfirmRecoveryTransaction(
        srm,
        safeAddress as Address,
        newOwners as Address[],
        newThreshold as number,
        shouldExecute
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
    confirmRecovery: () => {
      if (!validate().success) return;
      mutation.mutate();
    },
    txHash,
    error,
    isLoading,
    state,
  };
}
