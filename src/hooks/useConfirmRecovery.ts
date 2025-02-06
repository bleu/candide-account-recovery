"use client";

import { useMutation } from "@tanstack/react-query";
import { SocialRecoveryModule } from "abstractionkit";
import { useState } from "react";
import { Address } from "viem";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { useGuardians } from "./useGuardians";
import { getReadableError } from "@/utils/get-readable-error";

interface ConfirmRecoveryParams {
  safeAddress: Address | undefined;
  newOwners: Address[] | undefined;
  newThreshold: number | undefined;
  shouldExecute: boolean;
}

export function useConfirmRecovery({
  safeAddress,
  newOwners,
  newThreshold,
  shouldExecute,
}: ConfirmRecoveryParams) {
  const { address: signer } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);

  const { data: guardians } = useGuardians(safeAddress);

  const mutation = useMutation({
    mutationFn: async () => {
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
    error: mutation?.error && getReadableError(mutation.error),
    isLoading: mutation.isPending,
  };
}
