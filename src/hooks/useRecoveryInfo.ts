"use client";

import { SocialRecoveryModule } from "abstractionkit";
import { useAccount, usePublicClient } from "wagmi";
import { Address } from "viem";
import { useQuery } from "@tanstack/react-query";
import { socialRecoveryModuleAbi } from "@/utils/abis/socialRecoveryModuleAbi";

// Track a recovery process that has been approved by guardians
export function useRecoveryInfo(safeAddress?: Address) {
  const publicClient = usePublicClient();
  const account = useAccount();

  const addressToFetch = safeAddress ?? account?.address;

  return useQuery({
    queryKey: ["recoveryInfo", addressToFetch, publicClient?.transport.url],
    queryFn: async () => {
      if (!addressToFetch || !publicClient?.transport.url) {
        throw new Error("Account or publicClient transport URL not available");
      }
      try {
        const srm = new SocialRecoveryModule();
        const data = await publicClient.readContract({
          address: srm.moduleAddress as Address,
          abi: socialRecoveryModuleAbi,
          functionName: "getRecoveryRequest",
          args: [addressToFetch],
        });
        return data;
      } catch (e) {
        console.error(e);
        throw e;
      }
    },
    enabled: Boolean(addressToFetch) && Boolean(publicClient?.transport.url),
    staleTime: 120000, // 2 minutes
    refetchOnMount: false, // Don't refetch when component mounts
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnReconnect: false, // Don't refetch when reconnecting
  });
}
