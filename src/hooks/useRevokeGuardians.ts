"use client";

import { useSocialRecoveryModule } from "./use-social-recovery-module";
import { Address, encodeFunctionData, zeroAddress } from "viem";
import { useExecuteTransaction } from "./useExecuteTransaction";
import { useCallback } from "react";
import { SocialRecoveryModule } from "abstractionkit";
import { socialRecoveryModuleAbi } from "@/utils/abis/socialRecoveryModuleAbi";
import { useSrmData } from "./useSrmData";

async function buildRevokeGuardiansTxs(
  srm: SocialRecoveryModule,
  prevGuardian: Address,
  guardians: Address[],
  threshold: number
) {
  const txs = [];

  for (const guardian of guardians) {
    const revokeGuardianTx = {
      to: srm.moduleAddress,
      data: encodeFunctionData({
        abi: socialRecoveryModuleAbi,
        functionName: "revokeGuardianWithThreshold",
        args: [prevGuardian, guardian, BigInt(threshold)],
      }),
      value: BigInt(0),
    };
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
  onError?: (error: Error) => void;
}) {
  const { srm } = useSocialRecoveryModule();
  const { guardians: currentGuardians } = useSrmData();

  const buildTxFn = useCallback(async () => {
    if (!guardians) throw new Error("Missing guardians");
    if (threshold === undefined) throw new Error("Missing threshold");
    if (!srm) throw new Error("Missing srm");
    if (!currentGuardians) throw new Error("Missing currentGuardians");

    const prevGuardian = `${zeroAddress.slice(0, -1)}1` as Address;

    const txs = await buildRevokeGuardiansTxs(
      srm,
      prevGuardian,
      guardians,
      threshold
    );
    return txs;
  }, [guardians, threshold, srm, currentGuardians]);

  return useExecuteTransaction({
    buildTxFn,
    onSuccess,
    onError,
  });
}
