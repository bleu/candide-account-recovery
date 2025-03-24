"use client";

import { useSocialRecoveryModule } from "./use-social-recovery-module";
import { useCallback } from "react";
import { Address } from "viem";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { useExecuteTransaction } from "./use-execute-transaction";

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
  const { srm } = useSocialRecoveryModule({ safeAddress });

  const buildTxFn = useCallback(async () => {
    if (!safeAddress) {
      throw new Error("Safe address is required");
    }
    if (!signer || !walletClient || !publicClient || !srm) {
      throw new Error("Missing signer, srm or client");
    }

    const tx = srm.createFinalizeRecoveryMetaTransaction(safeAddress);

    return [
      {
        to: tx.to as Address,
        data: tx.data as `0x${string}`,
        value: tx.value,
      },
    ];
  }, [safeAddress, signer, walletClient, publicClient, srm]);

  return useExecuteTransaction({
    buildTxFn,
    onSuccess,
    onError,
  });
}
