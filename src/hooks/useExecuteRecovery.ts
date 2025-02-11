"use client";

import { SocialRecoveryModule } from "abstractionkit";
import { useCallback } from "react";
import { Address } from "viem";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { useExecuteTransaction } from "./useExecuteTransaction";

interface ExecuteRecoveryParams {
  safeAddress: Address | undefined;
  newOwners: Address[] | undefined;
  newThreshold: number | undefined;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useExecuteRecovery({
  safeAddress,
  newOwners,
  newThreshold,
  onSuccess,
  onError,
}: ExecuteRecoveryParams) {
  const { address: signer } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const buildTxFn = useCallback(async () => {
    if (!safeAddress) throw new Error("Safe address is required");
    if (!newOwners || newOwners.length === 0)
      throw new Error("New owners array is required and cannot be empty");
    if (newThreshold === undefined || newThreshold <= 0)
      throw new Error("New threshold must be greater than 0");
    if (!signer || !walletClient || !publicClient)
      throw new Error("Missing signer or client");

    const srm = new SocialRecoveryModule();

    const tx = srm.createExecuteRecoveryMetaTransaction(
      safeAddress,
      newOwners,
      newThreshold
    );

    return [
      {
        to: tx.to as Address,
        data: tx.data as `0x${string}`,
        value: tx.value,
      },
    ];
  }, [
    safeAddress,
    newOwners,
    newThreshold,
    signer,
    walletClient,
    publicClient,
  ]);

  return useExecuteTransaction({
    buildTxFn,
    onSuccess,
    onError,
  });
}
