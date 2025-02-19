"use client";

import {
  SocialRecoveryModule,
  SocialRecoveryModuleGracePeriodSelector,
} from "abstractionkit";
import { useAccount, useClient } from "wagmi";
import { Address } from "viem";
import { useQuery } from "@tanstack/react-query";

export function useGuardians(safeAddress?: Address) {
  const client = useClient();
  const account = useAccount();

  const addressToFetch = safeAddress ?? account?.address;

  return useQuery({
    queryKey: ["guardians", addressToFetch, client?.transport.url],
    queryFn: async () => {
      if (!addressToFetch || !client?.transport.url) {
        throw new Error("Account or client transport URL not available");
      }

      const srm = new SocialRecoveryModule(
        SocialRecoveryModuleGracePeriodSelector.After3Minutes
      );
      const guardians = (await srm.getGuardians(
        client.transport.url,
        addressToFetch
      )) as Address[];

      return guardians;
    },
    enabled: Boolean(addressToFetch) && Boolean(client?.transport.url),
  });
}
