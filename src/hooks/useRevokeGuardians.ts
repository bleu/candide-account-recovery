"use client";

import { SocialRecoveryModule } from "abstractionkit";
import { useState } from "react";
import { useAccount, useWalletClient, usePublicClient } from "wagmi";
import { Address, PublicClient } from "viem";
import { useMutation } from "@tanstack/react-query";
import { getReadableError } from "@/utils/get-readable-error";

async function buildRevokeGuardiansTxs(
  srm: SocialRecoveryModule,
  publicClient: PublicClient,
  signer: Address,
  guardians: Address[],
  threshold: number
) {
  const txs = [];

  for (const guardian of guardians) {
    const revokeGuardianTx =
      await srm.createRevokeGuardianWithThresholdMetaTransaction(
        publicClient?.transport.url,
        signer,
        guardian,
        BigInt(threshold)
      );
    txs.push(revokeGuardianTx);
  }

  return txs.map((tx) => ({
    to: tx.to as Address,
    data: tx.data as `0x${string}`,
    value: tx.value,
  }));
}

export function useRevokeGuardians(
  guardians: Address[] | undefined,
  threshold: number = 1
) {
  const { address: signer } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const [txHashes, setTxHashes] = useState<string[]>([]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!signer || !walletClient || !publicClient || !guardians) {
        throw new Error("Missing signer, client or guardians");
      }

      const srm = new SocialRecoveryModule();
      const txs = await buildRevokeGuardiansTxs(
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

  const revokeGuardians = () => {
    if (
      guardians &&
      guardians.length > 0 &&
      signer &&
      walletClient &&
      publicClient
    ) {
      mutation.mutate();
    }
  };

  const reset = () => {
    setTxHashes([]);
    mutation.reset();
  };

  return {
    txHashes,
    revokeGuardians,
    error: mutation?.error && getReadableError(mutation.error),
    isLoading: mutation.isPending,
    reset,
  };
}
