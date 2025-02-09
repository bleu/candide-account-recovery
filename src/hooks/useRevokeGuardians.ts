"use client";

import { Address } from "viem";
import { useAccount } from "wagmi";
import { useSrmStore } from "@/stores/useSrmStore";
import { useTransactionExecution } from "./useTransactionExecution";
import { ok } from "@/utils/result";
import { buildRevokeGuardiansTransaction } from "@/services/transactions";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import React from "react";

interface RevokeGuardiansParams {
  /** The address of the safe to revoke guardians for */
  safeAddress: Address | undefined;
  /** The addresses of the guardians to revoke */
  guardians: Address[] | undefined;
}

/**
 * Hook for revoking guardians from a safe
 *
 * @param params - The parameters for revoking guardians
 * @returns Object containing:
 * - revokeGuardians: Function to trigger the revocation
 * - txHash: Transaction hash if available
 * - error: Error message if any
 * - isLoading: Whether the transaction is in progress
 * - state: Current transaction state (EOA or Safe specific)
 */
export function useRevokeGuardians({
  safeAddress,
  guardians,
}: RevokeGuardiansParams) {
  const { address: account } = useAccount();
  const { srm } = useSrmStore();
  const queryClient = useQueryClient();

  // Validation function that returns Result<true>
  const validate = () => {
    if (!safeAddress) return ok(false);
    if (!guardians?.length) return ok(false);
    return ok(true as const);
  };

  const { txHash, error, isLoading, mutation, state } = useTransactionExecution(
    async () => {
      if (!account) throw new Error("Wallet not connected");
      if (!safeAddress) throw new Error("Missing safe address");
      if (!guardians?.length) throw new Error("No guardians to revoke");

      // Build transaction using our service
      const result = await buildRevokeGuardiansTransaction(
        srm,
        safeAddress,
        guardians,
        1, // Default threshold after revocation
        "0x" // Empty calldata since we're not executing
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
        queryKey: queryKeys.guardians(safeAddress),
      });
    }
  }, [state, account, queryClient, safeAddress]);

  return {
    revokeGuardians: () => {
      if (!validate().success) return;
      mutation.mutate();
    },
    txHash,
    error,
    isLoading,
    state,
  };
}
