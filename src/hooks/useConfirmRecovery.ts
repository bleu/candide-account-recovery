"use client";

import { SocialRecoveryModule } from "abstractionkit";
import { useCallback } from "react";
import { Address } from "viem";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { useGuardians } from "./useGuardians";
import { useExecuteTransaction } from "./useExecuteTransaction";

interface ConfirmRecoveryParams {
  safeAddress: Address | undefined;
  newOwners: Address[] | undefined;
  newThreshold: number | undefined;
  shouldExecute: boolean;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useConfirmRecovery({
  safeAddress,
  newOwners,
  newThreshold,
  shouldExecute,
  onSuccess,
  onError,
}: ConfirmRecoveryParams) {
  const { address: signer } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const { data: guardians } = useGuardians(safeAddress);

  const buildTxFn = useCallback(async () => {
    if (!safeAddress) {
      throw new Error("Safe address is required");
    }
    if (!newOwners || newOwners.length === 0) {
      throw new Error("New owners array is required and cannot be empty");
    }
    if (newThreshold === undefined || newThreshold <= 0) {
      throw new Error("New threshold must be greater than 0");
    }
    if (!signer || !walletClient || !publicClient) {
      throw new Error("Missing signer or client");
    }
    if (!guardians || !Object(guardians).includes(signer)) {
      throw new Error("Caller must be a guardian");
    }

    const srm = new SocialRecoveryModule();

    const tx = srm.createConfirmRecoveryMetaTransaction(
      safeAddress,
      newOwners,
      newThreshold,
      shouldExecute
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
    shouldExecute,
    signer,
    guardians,
    walletClient,
    publicClient,
  ]);

  return useExecuteTransaction({
    buildTxFn,
    onSuccess,
    onError,
  });
}
