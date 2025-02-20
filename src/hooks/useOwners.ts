"use client";

import { SafeAccountV0_3_0 } from "abstractionkit";
import { useAccount, useClient } from "wagmi";
import { Address } from "viem";
import { useQuery } from "@tanstack/react-query";

export function useOwners(safeAddress?: Address, chainId?: number) {
  const account = useAccount();

  const addressToFetch = safeAddress ?? account?.address;
  const chainIdToFetch = chainId ?? account?.chainId;

  const client = useClient({ chainId: chainIdToFetch });

  return useQuery({
    queryKey: ["owners", chainIdToFetch, addressToFetch],
    queryFn: async () => {
      if (!addressToFetch || !client?.transport.url) {
        throw new Error("Account or client transport URL not available");
      }

      const safeAccount = new SafeAccountV0_3_0(addressToFetch);
      const owners = (await safeAccount.getOwners(
        client.transport.url
      )) as Address[];
      return owners;
    },
    enabled: Boolean(addressToFetch) && Boolean(client?.transport.url),
  });
}
