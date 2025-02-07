"use client";

import { SocialRecoveryModule } from "abstractionkit";
import { useState } from "react";
import { useAccount, useWalletClient, usePublicClient } from "wagmi";
import { Address, PublicClient } from "viem";
import { useMutation } from "@tanstack/react-query";
import { getIsModuleEnabled } from "@/utils/getIsModuleEnabled";
import { getReadableError } from "@/utils/get-readable-error";

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

export function useAddGuardians(guardians: Address[], threshold: number = 1) {
  const { address: signer } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const [txHashes, setTxHashes] = useState<string[]>([]);

  const mutation = useMutation({
    mutationFn: async () => {
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
    },
  });

  const addGuardians = () => {
    if (guardians.length > 0 && signer && walletClient && publicClient) {
      mutation.mutate();
    }
  };

  return {
    txHashes,
    addGuardians,
    error: mutation?.error && getReadableError(mutation.error),
    isLoading: mutation.isPending,
  };
}
