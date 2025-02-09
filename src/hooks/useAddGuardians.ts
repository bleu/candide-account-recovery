"use client";

import { Address, PublicClient } from "viem";
import { useAccount, useWalletClient, usePublicClient } from "wagmi";
import { useTransactionExecution } from "./useTransactionExecution";
import { validateAddresses, validateThreshold } from "@/utils/validation";
import { ok } from "@/utils/result";
import { SocialRecoveryModule } from "abstractionkit";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import { getIsModuleEnabled } from "@/utils/getIsModuleEnabled";
import React, { useState } from "react";

async function buildAddGuardiansTxs(
  srm: SocialRecoveryModule,
  publicClient: PublicClient,
  signer: Address,
  guardians: Address[],
  threshold: number
) {
  const txs = [];

  const isModuleEnabled = await getIsModuleEnabled(
    publicClient,
    signer,
    srm.moduleAddress as Address
  );

  if (!isModuleEnabled) {
    const enableModuleTx = srm.createEnableModuleMetaTransaction(signer);
    txs.push(enableModuleTx);
  }

  for (const [idx, guardian] of guardians.entries()) {
    const addGuardianTx = srm.createAddGuardianWithThresholdMetaTransaction(
      guardian,
      BigInt(idx + 1 > threshold ? threshold : idx + 1)
    );
    txs.push(addGuardianTx);
  }

  return txs.map((tx) => ({
    to: tx.to as Address,
    data: tx.data as `0x${string}`,
    value: tx.value,
  }));
}

/**
 * Hook for adding guardians to a safe
 *
 * @param guardians - Array of guardian addresses to add
 * @param threshold - New threshold to set (defaults to 1)
 * @returns Object containing:
 * - addGuardians: Function to trigger adding guardians
 * - txHashes: Array of transaction hashes if available
 * - error: Error message if any
 * - isLoading: Whether the transaction is in progress
 * - state: Current transaction state (EOA or Safe specific)
 */
export function useAddGuardians(guardians: Address[], threshold: number = 1) {
  const { address: signer } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const queryClient = useQueryClient();
  const [txHashes, setTxHashes] = useState<string[]>([]);

  // Validation function that returns Result<true>
  const validate = () => {
    const addressResult = validateAddresses(guardians);
    if (!addressResult.success) return addressResult;

    const thresholdResult = validateThreshold(threshold);
    if (!thresholdResult.success) return thresholdResult;

    return ok(true as const);
  };

  const { error, isLoading, mutation, state } = useTransactionExecution(
    async () => {
      if (!signer || !walletClient || !publicClient) {
        throw new Error("Missing signer or client");
      }

      const srm = new SocialRecoveryModule();
      const txs = await buildAddGuardiansTxs(
        srm,
        publicClient,
        signer,
        guardians,
        threshold
      );

      if (txs.length < 1) throw new Error("No transaction to call");

      const newTxHashes = [];
      for (const tx of txs) {
        const txHash = await walletClient.sendTransaction(tx);
        newTxHashes.push(txHash);
      }
      setTxHashes(newTxHashes);
      return txs[0]; // Return first transaction for state tracking
    }
  );

  // Invalidate queries after successful transaction
  React.useEffect(() => {
    if (state === "success") {
      queryClient.invalidateQueries({
        queryKey: queryKeys.guardians(signer),
      });
    }
  }, [state, signer, queryClient]);

  const addGuardians = () => {
    if (!validate().success) return;
    if (guardians.length > 0 && signer && walletClient && publicClient) {
      mutation.mutate();
    }
  };

  return {
    txHashes,
    addGuardians,
    error,
    isLoading,
    state,
  };
}
