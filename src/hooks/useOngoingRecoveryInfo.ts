"use client";

import { SocialRecoveryModule } from "abstractionkit";
import { useAccount, usePublicClient } from "wagmi";
import { Address } from "viem";
import { useQuery } from "@tanstack/react-query";
import { socialRecoveryModuleAbi } from "@/utils/abis/socialRecoveryModuleAbi";
import { queryKeys } from "@/utils/queryKeys";

export interface RecoveryInfo {
  guardiansApprovalCount: number;
  newThreshold: number;
  executeAfter: number;
  newOwners: readonly Address[];
}

/**
 * Hook to fetch information about an ongoing recovery process
 *
 * @param safeAddress - Optional address of the safe to check. If not provided, uses connected account
 * @returns Query result containing recovery information
 */
export function useOngoingRecoveryInfo(safeAddress?: Address) {
  const publicClient = usePublicClient();
  const { address: account } = useAccount();

  const addressToFetch = safeAddress ?? account;

  return useQuery({
    queryKey: queryKeys.recoveryInfo(addressToFetch),
    queryFn: async () => {
      if (!addressToFetch) {
        throw new Error("No address provided");
      }
      if (!publicClient?.transport.url) {
        throw new Error("No public client available");
      }

      const srm = new SocialRecoveryModule();
      const data = await publicClient.readContract({
        address: srm.moduleAddress as Address,
        abi: socialRecoveryModuleAbi,
        functionName: "getRecoveryRequest",
        args: [addressToFetch],
      });

      return {
        guardiansApprovalCount: Number(data.guardiansApprovalCount),
        newThreshold: Number(data.newThreshold),
        executeAfter: Number(data.executeAfter),
        newOwners: data.newOwners,
      };
    },
    enabled: Boolean(addressToFetch) && Boolean(publicClient?.transport.url),
    staleTime: 30_000, // 30 seconds
    gcTime: 60_000, // 1 minute
    retry: (failureCount, error) => {
      // Don't retry on user errors
      if (
        error instanceof Error &&
        error.message.includes("No address provided")
      ) {
        return false;
      }
      return failureCount < 3;
    },
  });
}
