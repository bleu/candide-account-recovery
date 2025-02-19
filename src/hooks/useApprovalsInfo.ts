"use client";

import { useSocialRecoveryModule } from "./use-social-recovery-module";
import { useAccount, useClient } from "wagmi";
import { Address } from "viem";
import { useQuery } from "@tanstack/react-query";
import { getGuardianNickname, getStoredGuardians } from "@/utils/storage";
import { useGuardians } from "./useGuardians";
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
}: {
  safeAddress?: Address | undefined;
  newOwners: Address[] | undefined;
  newThreshold: number | undefined;
}) {
  const client = useClient();
  const { chainId } = useAccount();
  const { data: guardians } = useGuardians(safeAddress);
  const { srm } = useSocialRecoveryModule({ safeAddress });

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
        !chainId
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
        chainId,
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
      Boolean(chainId),
  });
}
