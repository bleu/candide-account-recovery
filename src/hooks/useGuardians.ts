"use client";

import { useSocialRecoveryModule } from "./use-social-recovery-module";
import { useAccount, useClient } from "wagmi";
import { Address } from "viem";
import { useQuery } from "@tanstack/react-query";

export function useGuardians(safeAddress?: Address, chainId?: number) {
  const { address, chainId: accountChainId } = useAccount();
  const { srm } = useSocialRecoveryModule({ safeAddress, chainId });

  const chainIdToFetch = chainId ?? accountChainId;
  const addressToFetch = safeAddress ?? address;

  const client = useClient({ chainId: chainIdToFetch });

  return useQuery({
    queryKey: ["guardians", chainIdToFetch, addressToFetch],
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
    structuralSharing: false,
    enabled:
      Boolean(addressToFetch) && Boolean(client?.transport.url) && Boolean(srm),
  });
}
