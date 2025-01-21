"use client";

import { SocialRecoveryModule } from "abstractionkit";
import { useAccount, useClient } from "wagmi";
import { Address } from "viem";
import { useQuery } from "@tanstack/react-query";

export function useGuardians() {
  const client = useClient();
  const account = useAccount();

  return useQuery({
    queryKey: ["guardians", account?.address, client?.transport.url],
    queryFn: async () => {
      if (!account?.address || !client?.transport.url) {
        throw new Error("Account or client transport URL not available");
      }

      const srm = new SocialRecoveryModule();
      const guardians = (await srm.getGuardians(
        client.transport.url,
        account.address
      )) as Address[];

      return guardians;
    },
    enabled: Boolean(account?.address) && Boolean(client?.transport.url),
  });
}
