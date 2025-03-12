"use client";

import { useSocialRecoveryModule } from "./use-social-recovery-module";
import { useAccount, useClient } from "wagmi";
import { Address } from "viem";
import { useQuery } from "@tanstack/react-query";
import { getGuardianNickname, getStoredGuardians } from "@/utils/storage";
import { useSrmData } from "./useSrmData";
import { NewAddress } from "@/components/guardian-list";

export interface ApprovalsInfo {
  guardiansApprovals: NewAddress[];
  totalGuardianApprovals: number;
  guardiansThreshold: number;
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
  const { guardians } = useSrmData(safeAddress, chainId);
  const { srm } = useSocialRecoveryModule({ safeAddress, chainId });
  const chainIdToFetch = chainId ?? chainIdFromWallet;
  const client = useClient({ chainId: chainIdToFetch });

  return useQuery<ApprovalsInfo>({
    queryKey: ["approvalsInfo", safeAddress, newOwners, newThreshold],
    queryFn: async () => {
      if (
        !safeAddress ||
        !newOwners ||
        !newThreshold ||
        !client?.transport.url ||
        !guardians ||
        !srm ||
        !chainIdToFetch
      ) {
        throw new Error("A needed parameter is not available");
      }

      const guardiansApprovalsList = await Promise.all(
        guardians.map((guardian) =>
          srm.hasGuardianApproved(
            client.transport.url,
            safeAddress,
            guardian,
            newOwners,
            newThreshold
          )
        )
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

      const guardiansThreshold = Number(
        await srm.threshold(client.transport.url, safeAddress)
      );

      return {
        guardiansApprovals,
        totalGuardianApprovals,
        guardiansThreshold,
        pendingGuardians,
      };
    },
    enabled:
      Boolean(safeAddress) &&
      Boolean(newOwners) &&
      Boolean(newThreshold) &&
      Boolean(client?.transport.url) &&
      Boolean(guardians) &&
      Boolean(srm) &&
      Boolean(chainIdToFetch),
  });
}
