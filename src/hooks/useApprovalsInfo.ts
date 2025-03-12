"use client";

import { useSocialRecoveryModule } from "./use-social-recovery-module";
import { useAccount, usePublicClient } from "wagmi";
import { Address } from "viem";
import { useQuery } from "@tanstack/react-query";
import { getGuardianNickname, getStoredGuardians } from "@/utils/storage";
import { useSrmData } from "./useSrmData";
import { NewAddress } from "@/components/guardian-list";
import { socialRecoveryModuleAbi } from "@/utils/abis/socialRecoveryModuleAbi";

export interface ApprovalsInfo {
  guardiansApprovals: NewAddress[];
  totalGuardianApprovals: number;
  guardiansThreshold: number | undefined;
  pendingGuardians: Address[];
}

export function useApprovalsInfo({
  safeAddress,
  newOwners,
  newThreshold,
  chainId,
}: {
  safeAddress?: Address | undefined;
  newOwners: Address[] | undefined;
  newThreshold: number | undefined;
  chainId?: number;
}) {
  const { chainId: chainIdFromWallet } = useAccount();
  const { guardians, threshold } = useSrmData(safeAddress, chainId);
  const { srm } = useSocialRecoveryModule({ safeAddress, chainId });
  const chainIdToFetch = chainId ?? chainIdFromWallet;
  const client = usePublicClient({ chainId: chainIdToFetch });

  return useQuery<ApprovalsInfo>({
    queryKey: ["approvalsInfo", safeAddress, newOwners, newThreshold],
    queryFn: async () => {
      if (
        !safeAddress ||
        !newOwners ||
        !newThreshold ||
        !guardians ||
        !srm ||
        !chainIdToFetch ||
        !client
      ) {
        throw new Error("A needed parameter is not available");
      }

      const guardiansApprovalsListResults = await client.multicall({
        contracts: guardians.map((guardian) => {
          return {
            address: srm.moduleAddress as Address,
            abi: socialRecoveryModuleAbi,
            functionName: "hasGuardianApproved",
            args: [safeAddress, guardian, newOwners, BigInt(newThreshold)],
          };
        }),
      });

      const guardiansApprovalsList = guardiansApprovalsListResults.map(
        (result) => result.status === "success" && result.result
      );

      const storedGuardians = getStoredGuardians(
        chainIdToFetch,
        safeAddress.toLowerCase() as Address
      );

      const guardiansApprovals = guardians.map((guardian, idx) => ({
        nickname:
          getGuardianNickname(guardian as Address, storedGuardians) ??
          `Guardian ${idx + 1}`,
        address: guardian,
        status: guardiansApprovalsList[idx] ? "Approved" : "Pending",
      }));

      const totalGuardianApprovals = guardiansApprovals.filter(
        (guardian) => guardian.status === "Approved"
      ).length;

      const pendingGuardians = guardiansApprovals
        .filter((guardian) => guardian.status === "Pending")
        .map((guardian) => guardian.address);

      return {
        guardiansApprovals,
        totalGuardianApprovals,
        guardiansThreshold: threshold,
        pendingGuardians,
      };
    },
    enabled:
      Boolean(safeAddress) &&
      Boolean(newOwners) &&
      Boolean(newThreshold) &&
      Boolean(guardians) &&
      Boolean(srm) &&
      Boolean(chainIdToFetch),
  });
}
