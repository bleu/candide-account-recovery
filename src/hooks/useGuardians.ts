"use client";

import { useSocialRecoveryModule } from "./use-social-recovery-module";
import { useAccount, useClient } from "wagmi";
import { Address } from "viem";
import { useQuery } from "@tanstack/react-query";

export function useGuardians(safeAddress?: Address) {
  const client = useClient();
  const { address, chainId } = useAccount();
  const { srm } = useSocialRecoveryModule({ safeAddress });

  const addressToFetch = safeAddress ?? address;

  return useQuery({
    queryKey: ["guardians", chainId, addressToFetch],
    queryFn: async () => {
      if (!addressToFetch || !client?.transport.url || !srm) {
        throw new Error("Account, srm or client transport URL not available");
      }

      const guardians = (await srm.getGuardians(
        client.transport.url,
        addressToFetch
      )) as Address[];

      return guardians;
    },
    enabled:
      Boolean(addressToFetch) && Boolean(client?.transport.url) && Boolean(srm),
  });
}
