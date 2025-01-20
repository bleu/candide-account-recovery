"use client";

import { SafeAccountV0_3_0 } from "abstractionkit";
import { useAccount, useClient } from "wagmi";
import { Address } from "viem";
import { useQuery } from "@tanstack/react-query";

export function useOwners() {
  const client = useClient();
  const account = useAccount();

  return useQuery({
    queryKey: ["owners", account?.address, client?.transport.url],
    queryFn: async () => {
      if (!account?.address || !client?.transport.url) {
        throw new Error("Account or client transport URL not available");
      }

      const safeAccount = new SafeAccountV0_3_0(account.address);
      const owners = (await safeAccount.getOwners(
        client.transport.url
      )) as Address[];
      return owners;
    },
    enabled: Boolean(account?.address) && Boolean(client?.transport.url),
  });
}
