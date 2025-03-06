"use client";

import {
  SrmAddress,
  useSocialRecoveryModule,
} from "./use-social-recovery-module";
import { useCallback } from "react";
import { useAccount, useWalletClient, usePublicClient } from "wagmi";
import { Address, encodeFunctionData, PublicClient, zeroAddress } from "viem";
import { useExecuteTransaction } from "./useExecuteTransaction";
import { SocialRecoveryModule } from "abstractionkit";
import { useGuardians } from "./useGuardians";
import { buildAddGuardiansTxs } from "./useAddGuardians";
import { delayPeriodMap } from "@/app/protect-account/page";
import { socialRecoveryModuleAbi } from "@/utils/abis/socialRecoveryModuleAbi";

async function buildUpdateDelayPeriodTxs(
  oldSrm: SocialRecoveryModule,
  newSrm: SocialRecoveryModule,
  publicClient: PublicClient,
  signer: Address,
  guardians: Address[],
  threshold: number
) {
  const removeGuardiansTxs = [];
  for (const [idx, guardian] of guardians.entries()) {
    const prevGuardian = `${zeroAddress.slice(0, -1)}1` as Address;
    const revokeGuardianTx = {
      to: oldSrm.moduleAddress,
      data: encodeFunctionData({
        abi: socialRecoveryModuleAbi,
        functionName: "revokeGuardianWithThreshold",
        args: [prevGuardian, guardian, BigInt(guardians.length - idx - 1)],
      }),
      value: BigInt(0),
    };
    removeGuardiansTxs.push(revokeGuardianTx);
  }

  const addGuardiansTxs = await buildAddGuardiansTxs(
    newSrm,
    publicClient,
    signer,
    guardians,
    0,
    threshold
  );

  const txs = [...removeGuardiansTxs, ...addGuardiansTxs];

  return txs.map((tx) => ({
    to: tx.to as Address,
    data: tx.data as `0x${string}`,
    value: tx.value,
  }));
}

async function buildUpdateThresholdTxs(
  srm: SocialRecoveryModule,
  threshold: number
) {
  const tx = srm.createChangeThresholdMetaTransaction(BigInt(threshold));
  return [
    {
      to: tx.to as Address,
      data: tx.data as `0x${string}`,
      value: tx.value,
    },
  ];
}

export function useUpdateParameters({
  threshold,
  delayPeriod,
  onSuccess,
  onError,
}: {
  threshold: number | undefined;
  delayPeriod: number | undefined;
  srmAddress?: SrmAddress;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const { address: signer } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { srm: oldSrm } = useSocialRecoveryModule();
  const newSrmAddress = delayPeriod ? delayPeriodMap[delayPeriod] : undefined;
  const { srm: newSrm } = useSocialRecoveryModule({
    srmAddress: newSrmAddress,
  });
  const { data: currentGuardians } = useGuardians();
  const { data: guardians } = useGuardians();

  const buildTxFn = useCallback(async () => {
    if (
      !signer ||
      !walletClient ||
      !publicClient ||
      !threshold ||
      !delayPeriod ||
      !currentGuardians ||
      !oldSrm ||
      !newSrm ||
      !guardians ||
      !guardians.length
    ) {
      throw new Error("Missing params");
    }

    const txs =
      oldSrm.moduleAddress === newSrm.moduleAddress
        ? await buildUpdateThresholdTxs(oldSrm, threshold)
        : buildUpdateDelayPeriodTxs(
            oldSrm,
            newSrm,
            publicClient,
            signer,
            guardians,
            threshold
          );

    return txs;
  }, [
    signer,
    publicClient,
    walletClient,
    guardians,
    threshold,
    oldSrm,
    newSrm,
    delayPeriod,
    currentGuardians,
  ]);

  return useExecuteTransaction({
    buildTxFn,
    onSuccess,
    onError,
  });
}
