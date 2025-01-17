"use client";

import { SocialRecoveryModule } from "abstractionkit";
import { useCallback, useState } from "react";
import { useAccount, useWalletClient, usePublicClient } from "wagmi";
import { Address, PublicClient } from "viem";
import useSWRMutation from "swr/mutation";
import { getIsModuleEnabled } from "@/utils/getIsModuleEnabled";

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

  for (const guardian of guardians) {
    const addGuardianTx = srm.createAddGuardianWithThresholdMetaTransaction(
      guardian,
      BigInt(threshold)
    );
    txs.push(addGuardianTx);
  }

  return txs.map((tx) => {
    return {
      to: tx.to as Address,
      data: tx.data as `0x${string}`,
      value: tx.value,
    };
  });
}

export function useAddGuardians(guardians: Address[], threshold: number = 1) {
  const { address: signer } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const [txHashes, setTxHashes] = useState<string[]>([]);

  const addGuardians = useCallback(async () => {
    if (!signer || !walletClient || !publicClient)
      throw new Error("Missing signer or client");

    const srm = new SocialRecoveryModule();
    const txs = await buildAddGuardiansTxs(
      srm,
      publicClient,
      signer,
      guardians,
      threshold
    );

    console.log({ txs });
    if (txs.length < 1) throw new Error("No transaction to call");

    const newTxHashes = [];
    for (const tx of txs) {
      const txHash = await walletClient.sendTransaction(tx);
      newTxHashes.push(txHash);
    }
    setTxHashes(newTxHashes);
  }, [signer, walletClient, publicClient, guardians, threshold]);

  const {
    isMutating: isLoading,
    trigger,
    error,
    reset,
  } = useSWRMutation<void>(
    signer && walletClient && publicClient && guardians.length > 0
      ? "guardians"
      : null,
    addGuardians
  );

  const triggerAddGuardians = () => {
    reset();
    trigger();
  };

  console.log({ txHashes, error, isLoading });

  return {
    txHashes,
    addGuardians: triggerAddGuardians,
    error: error?.shortMessage
      ? `Error: ${error.shortMessage}`
      : error?.message,
    isLoading,
  };
}
