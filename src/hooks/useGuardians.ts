"use client";

import { SocialRecoveryModule } from "abstractionkit";
import { useAccount, usePublicClient } from "wagmi";
import { Address } from "viem";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";

/**
 * Hook to fetch the list of guardians for a safe
 *
 * @param safeAddress - Optional address of the safe to check. If not provided, uses connected account
 * @returns Query result containing array of guardian addresses
 */
export function useGuardians(safeAddress?: Address) {
  const publicClient = usePublicClient();
  const { address: account } = useAccount();

  const addressToFetch = safeAddress ?? account;

  return useQuery({
    queryKey: queryKeys.guardians(addressToFetch),
    queryFn: async () => {
      if (!addressToFetch) {
        throw new Error("No address provided");
      }
      if (!publicClient?.transport.url) {
        throw new Error("No public client available");
      }

      const srm = new SocialRecoveryModule();
      const guardians = (await srm.getGuardians(
        publicClient.transport.url,
        addressToFetch
      )) as Address[];

      return guardians;
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
