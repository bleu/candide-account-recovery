"use client";

import { useSocialRecoveryModule } from "./use-social-recovery-module";
import { useCallback } from "react";
import { useAccount, useWalletClient, usePublicClient } from "wagmi";
import { Address, PublicClient } from "viem";
import { getIsModuleEnabled } from "@/utils/getIsModuleEnabled";
import { useExecuteTransaction } from "./useExecuteTransaction";
import { SocialRecoveryModule } from "abstractionkit";
import { useGuardians } from "./useGuardians";

async function buildAddGuardiansTxs(
  srm: SocialRecoveryModule,
  publicClient: PublicClient,
  signer: Address,
  guardians: Address[],
  currentGuardiansCount: number,
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
      BigInt(
        currentGuardiansCount + idx + 1 > threshold
          ? threshold
          : currentGuardiansCount + idx + 1
      )
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
  const { srm } = useSocialRecoveryModule();
  const { data: currentGuardians } = useGuardians();

  const buildTxFn = useCallback(async () => {
    if (
      !signer ||
      !walletClient ||
      !publicClient ||
      !guardians ||
      !threshold ||
      !currentGuardians ||
      !srm
    ) {
      throw new Error("Missing params");
    }

    const txs = await buildAddGuardiansTxs(
      srm,
      publicClient,
      signer,
      guardians,
      currentGuardians.length,
      threshold
    );

    return txs;
  }, [
    signer,
    publicClient,
    walletClient,
    guardians,
    threshold,
    srm,
    currentGuardians,
  ]);

  return useExecuteTransaction({
    buildTxFn,
    onSuccess,
    onError,
  });
}
