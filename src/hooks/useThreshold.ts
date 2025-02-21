"use client";

import { useSocialRecoveryModule } from "./use-social-recovery-module";
import { useAccount, useClient } from "wagmi";
import { Address } from "viem";
import { useQuery } from "@tanstack/react-query";

export function useThreshold(safeAddress?: Address) {
  const client = useClient();
  const account = useAccount();
  const { srm } = useSocialRecoveryModule({ safeAddress });

  const addressToFetch = safeAddress ?? account?.address;

  return useQuery({
    queryKey: ["threhsold", addressToFetch],
    queryFn: async () => {
      if (!addressToFetch || !client?.transport.url || !srm) {
        throw new Error("Account, srm, or client transport URL not available");
      }

      const threhsold = await srm.threshold(
        client.transport.url,
        addressToFetch
      );

      return Number(threhsold);
    },
    enabled: Boolean(addressToFetch) && Boolean(client?.transport.url),
  });
}
