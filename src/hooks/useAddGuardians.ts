"use client";

import { SocialRecoveryModule } from "abstractionkit";
import { useCallback } from "react";
import { useAccount, useWalletClient, usePublicClient } from "wagmi";
import { Address, PublicClient } from "viem";
import { getIsModuleEnabled } from "@/utils/getIsModuleEnabled";
import { useExecuteTransaction } from "./useExecuteTransaction";

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

export function useAddGuardians({
  guardians,
  threshold,
  onSuccess,
  onError,
}: {
  guardians: Address[] | undefined;
  threshold: number | undefined;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const { address: signer } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const buildTxFn = useCallback(async () => {
    if (!signer || !walletClient || !publicClient || !guardians || !threshold) {
      throw new Error("Missing params");
    }

    const srm = new SocialRecoveryModule();
    const txs = await buildAddGuardiansTxs(
      srm,
      publicClient,
      signer,
      guardians,
      threshold
    );

    return txs;
  }, [signer, publicClient, walletClient, guardians, threshold]);

  return useExecuteTransaction({
    buildTxFn,
    onSuccess,
    onError,
  });
}
