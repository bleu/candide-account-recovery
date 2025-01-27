"use client";

import { SocialRecoveryModule } from "abstractionkit";
import { useAccount, useClient } from "wagmi";
import { Address } from "viem";
import { useQuery } from "@tanstack/react-query";

export function useGuardians(safeAddress?: Address) {
  const client = useClient();
  const account = useAccount();

  const addressToSearch = safeAddress ?? account?.address;

  return useQuery({
    queryKey: ["guardians", account?.address, client?.transport.url],
    queryFn: async () => {
      if (!addressToSearch || !client?.transport.url) {
        throw new Error("Account or client transport URL not available");
      }

      const srm = new SocialRecoveryModule();
      const guardians = (await srm.getGuardians(
        client.transport.url,
        addressToSearch
      )) as Address[];

      return guardians;
    },
    enabled: Boolean(addressToSearch) && Boolean(client?.transport.url),
  });
}
