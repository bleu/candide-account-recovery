"use client";

import {
  SocialRecoveryModule,
  SocialRecoveryModuleGracePeriodSelector,
} from "abstractionkit";
import { useCallback } from "react";
import { Address } from "viem";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { useExecuteTransaction } from "./useExecuteTransaction";

interface FinalizeRecoveryParams {
  safeAddress: Address | undefined;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useFinalizeRecovery({
  safeAddress,
  onSuccess,
  onError,
}: FinalizeRecoveryParams) {
  const { address: signer } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const buildTxFn = useCallback(async () => {
    if (!safeAddress) {
      throw new Error("Safe address is required");
    }
    if (!signer || !walletClient || !publicClient) {
      throw new Error("Missing signer or client");
    }

    const srm = new SocialRecoveryModule(
      SocialRecoveryModuleGracePeriodSelector.After3Minutes
    );

    const tx = srm.createFinalizeRecoveryMetaTransaction(safeAddress);

    return [
      {
        to: tx.to as Address,
        data: tx.data as `0x${string}`,
        value: tx.value,
      },
    ];
  }, [safeAddress, signer, walletClient, publicClient]);

  return useExecuteTransaction({
    buildTxFn,
    onSuccess,
    onError,
  });
}
