"use client";

import { useAccount, usePublicClient } from "wagmi";
import { Address } from "viem";
import { useQuery } from "@tanstack/react-query";
import { getIsModuleEnabled } from "@/utils/getIsModuleEnabled";
import { useSrmStore } from "@/stores/useSrmStore";

export function useIsModuleEnabled(safeAddress?: Address) {
  const { address: account } = useAccount();
  const publicClient = usePublicClient();
  const { srm } = useSrmStore();

  const addressToCheck = safeAddress ?? account;

  return useQuery({
    queryKey: ["moduleEnabled", addressToCheck, publicClient?.transport.url],
    queryFn: async () => {
      if (!addressToCheck || !publicClient) return false;
      return getIsModuleEnabled(
        publicClient,
        addressToCheck,
        srm.moduleAddress as Address
      );
    },
    enabled: Boolean(addressToCheck) && Boolean(publicClient),
  });
}
