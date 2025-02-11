"use client";

import { SocialRecoveryModule } from "abstractionkit";
import { useAccount, useWalletClient, usePublicClient } from "wagmi";
import { Address, PublicClient } from "viem";
import { useExecuteTransaction } from "./useExecuteTransaction";
import { useCallback } from "react";

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
        publicClient.transport.url,
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

export function useRevokeGuardians({
  guardians,
  threshold,
  onSuccess,
  onError,
}: {
  guardians: Address[] | undefined;
  threshold: number | undefined;
  onSuccess?: () => void;
  onError?: () => void;
}) {
  const { address: signer } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const buildTxFn = useCallback(async () => {
    if (!signer) throw new Error("Missing signer");
    if (!walletClient) throw new Error("Missing wallet client");
    if (!publicClient) throw new Error("Missing public client");
    if (!guardians) throw new Error("Missing guardians");
    if (threshold === undefined) throw new Error("Missing threshold");

    const srm = new SocialRecoveryModule();

    const txs = await buildRevokeGuardiansTxs(
      srm,
      publicClient,
      signer,
      guardians,
      threshold
    );
    return txs;
  }, [signer, walletClient, publicClient, guardians, threshold]);

  return useExecuteTransaction({
    buildTxFn,
    onSuccess,
    onError,
  });
}
