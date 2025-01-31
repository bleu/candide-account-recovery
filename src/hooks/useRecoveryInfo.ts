"use client";

import { SocialRecoveryModule } from "abstractionkit";
import { useAccount, useClient } from "wagmi";
import { Address } from "viem";
import { useQuery } from "@tanstack/react-query";

// Track a recovery process that has been approved by guardians
export function useRecoveryInfo(safeAddress?: Address) {
  const client = useClient();
  const account = useAccount();

  const addressToFetch = safeAddress ?? account?.address;

  return useQuery({
    queryKey: ["guardians", addressToFetch, client?.transport.url],
    queryFn: async () => {
      if (!addressToFetch || !client?.transport.url) {
        throw new Error("Account or client transport URL not available");
      }
      try {
        const srm = new SocialRecoveryModule();
        const data = await srm.getRecoveryRequest(
          client.transport.url,
          addressToFetch
        );

        return data;
      } catch (e) {
        console.error(e);
        throw e;
      }
    },
    enabled: Boolean(addressToFetch) && Boolean(client?.transport.url),
    staleTime: Infinity, // Data will never become stale
    refetchOnMount: false, // Don't refetch when component mounts
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnReconnect: false, // Don't refetch when reconnecting
  });
}
