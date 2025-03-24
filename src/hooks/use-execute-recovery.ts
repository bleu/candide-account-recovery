"use client";

import { useSocialRecoveryModule } from "./use-social-recovery-module";
import { useCallback } from "react";
import { Address } from "viem";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { useExecuteTransaction } from "./use-execute-transaction";

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
  const { srm } = useSocialRecoveryModule({ safeAddress });

  const buildTxFn = useCallback(async () => {
    if (!safeAddress) throw new Error("Safe address is required");
    if (!newOwners || newOwners.length === 0)
      throw new Error("New owners array is required and cannot be empty");
    if (newThreshold === undefined || newThreshold <= 0)
      throw new Error("New threshold must be greater than 0");
    if (!signer || !walletClient || !publicClient || !srm)
      throw new Error("Missing signer, srm or client");

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
    srm,
  ]);

  return useExecuteTransaction({
    buildTxFn,
    onSuccess,
    onError,
  });
}
