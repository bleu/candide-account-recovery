"use client";

import { SocialRecoveryModule } from "abstractionkit";
import { useAccount, useClient } from "wagmi";
import { Address } from "viem";
import { useQuery } from "@tanstack/react-query";

export function useThreshold(safeAddress?: Address) {
  const client = useClient();
  const account = useAccount();

  const addressToFetch = safeAddress ?? account?.address;

  return useQuery({
    queryKey: ["threhsold", addressToFetch, client?.transport.url],
    queryFn: async () => {
      if (!addressToFetch || !client?.transport.url) {
        throw new Error("Account or client transport URL not available");
      }

      const srm = new SocialRecoveryModule();
      const threhsold = await srm.threshold(
        client.transport.url,
        addressToFetch
      );

      return Number(threhsold);
    },
    enabled: Boolean(addressToFetch) && Boolean(client?.transport.url),
  });
}
