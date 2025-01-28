"use client";

import { useMutation } from "@tanstack/react-query";
import { SocialRecoveryModule } from "abstractionkit";
import { useState } from "react";
import { Address } from "viem";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { useGuardians } from "./useGuardians";

interface ConfirmRecoveryParams {
  safeAddress: Address;
  newOwners: Address[];
  newThreshold: number;
}

export function useConfirmRecovery({
  safeAddress,
  newOwners,
  newThreshold,
}: ConfirmRecoveryParams) {
  const { address: signer } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);

  const { data: guardians } = useGuardians(safeAddress);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!signer || !walletClient || !publicClient) {
        throw new Error("Missing signer or client");
      }

      if (!Object(guardians).includes(signer))
        throw new Error("Caller must be a guardian");

      const srm = new SocialRecoveryModule();

      const approvalsCount = Number(
        await srm.getRecoveryApprovals(
          publicClient.transport.url,
          safeAddress,
          newOwners,
          newThreshold
        )
      );

      const guardiansThreshold = Number(
        await srm.threshold(publicClient.transport.url, safeAddress)
      );

      const shouldExecute = approvalsCount + 1 >= guardiansThreshold;

      const tx = srm.createConfirmRecoveryMetaTransaction(
        safeAddress,
        newOwners,
        newThreshold,
        shouldExecute
      );

      const newTxHash = await walletClient.sendTransaction({
        to: tx.to as Address,
        data: tx.data as `0x${string}`,
        value: tx.value,
      });

      setTxHash(newTxHash);
    },
  });

  const confirmRecovery = () => {
    if (signer && walletClient && publicClient) {
      mutation.mutate();
    }
  };

  return {
    txHash,
    confirmRecovery,
    error: mutation?.error && mutation.error,
    isLoading: mutation.isPending,
  };
}
