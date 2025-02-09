"use client";

import { SocialRecoveryModule } from "abstractionkit";
import { useAccount, usePublicClient } from "wagmi";
import { Address } from "viem";
import { useQuery } from "@tanstack/react-query";
import { getGuardianNickname, getStoredGuardians } from "@/utils/storage";
import { useGuardians } from "./useGuardians";
import { NewAddress } from "@/components/guardian-list";
import { queryKeys } from "@/utils/queryKeys";

export interface ApprovalsInfo {
  guardiansApprovals: NewAddress[];
  totalGuardianApprovals: number;
  guardiansThreshold: number;
  pendingGuardians: Address[];
}

interface UseApprovalsInfoParams {
  safeAddress?: Address;
  newOwners: Address[] | undefined;
  newThreshold: number | undefined;
}

/**
 * Hook to fetch information about guardian approvals for a recovery request
 *
 * @param params - Parameters for the approvals query
 * @returns Query result containing approvals information
 */
export function useApprovalsInfo({
  safeAddress,
  newOwners,
  newThreshold,
}: UseApprovalsInfoParams) {
  const publicClient = usePublicClient();
  const { chainId } = useAccount();
  const { data: guardians } = useGuardians(safeAddress);

  return useQuery({
    queryKey: queryKeys.approvalsInfo({ safeAddress, newOwners, newThreshold }),
    queryFn: async () => {
      if (!safeAddress) {
        throw new Error("No safe address provided");
      }
      if (!newOwners?.length) {
        throw new Error("No new owners provided");
      }
      if (!newThreshold) {
        throw new Error("No threshold provided");
      }
      if (!publicClient?.transport.url) {
        throw new Error("No public client available");
      }
      if (!guardians?.length) {
        throw new Error("No guardians found");
      }
      if (!chainId) {
        throw new Error("No chain ID available");
      }

      const srm = new SocialRecoveryModule();

      // Get approval status for each guardian
      const guardiansApprovalsList = await Promise.all(
        guardians.map((guardian) =>
          srm.hasGuardianApproved(
            publicClient.transport.url,
            safeAddress,
            guardian,
            newOwners,
            newThreshold
          )
        )
      );

      // Get stored nicknames for guardians
      const storedGuardians = getStoredGuardians(
        chainId,
        safeAddress.toLowerCase() as Address
      );

      // Build approvals list with nicknames
      const guardiansApprovals = guardians.map((guardian, idx) => ({
        nickname:
          getGuardianNickname(guardian as Address, storedGuardians) ??
          `Guardian ${idx + 1}`,
        address: guardian,
        status: guardiansApprovalsList[idx] ? "Approved" : "Pending",
      }));

      // Count total approvals
      const totalGuardianApprovals = guardiansApprovals.filter(
        (guardian) => guardian.status === "Approved"
      ).length;

      // Get pending guardians
      const pendingGuardians = guardiansApprovals
        .filter((guardian) => guardian.status === "Pending")
        .map((guardian) => guardian.address);

      // Get threshold
      const guardiansThreshold = Number(
        await srm.threshold(publicClient.transport.url, safeAddress)
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
      Boolean(newOwners?.length) &&
      Boolean(newThreshold) &&
      Boolean(publicClient?.transport.url) &&
      Boolean(guardians?.length) &&
      Boolean(chainId),
    staleTime: 30_000, // 30 seconds
    gcTime: 60_000, // 1 minute
    retry: (failureCount, error) => {
      // Don't retry on user errors
      if (
        error instanceof Error &&
        (error.message.includes("No") || error.message.includes("not"))
      ) {
        return false;
      }
      return failureCount < 3;
    },
  });
}
