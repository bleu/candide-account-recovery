"use client";

import { useSocialRecoveryModule } from "./use-social-recovery-module";
import { useAccount, usePublicClient } from "wagmi";
import { Address } from "viem";
import { useQuery } from "@tanstack/react-query";
import { socialRecoveryModuleAbi } from "@/utils/abis/socialRecoveryModuleAbi";

export interface RecoveryInfo {
  guardiansApprovalCount: number;
  newThreshold: number;
  executeAfter: number;
  newOwners: readonly Address[];
}

export function useOngoingRecoveryInfo(
  safeAddress?: Address,
  chainId?: number
) {
  const account = useAccount();
  const { srm } = useSocialRecoveryModule({ safeAddress, chainId });

  const chainIdToFetch = chainId ?? account?.chainId;
  const addressToFetch = safeAddress ?? account?.address;

  const publicClient = usePublicClient({ chainId: chainIdToFetch });

  return useQuery<RecoveryInfo>({
    queryKey: ["recoveryInfo", chainIdToFetch, addressToFetch],
    queryFn: async () => {
      if (!addressToFetch || !publicClient?.transport.url || !srm) {
        throw new Error(
          "Account, srm or publicClient transport URL not available"
        );
      }
      try {
        const data = await publicClient.readContract({
          address: srm.moduleAddress as Address,
          abi: socialRecoveryModuleAbi,
          functionName: "getRecoveryRequest",
          args: [addressToFetch],
        });
        return {
          guardiansApprovalCount: Number(data.guardiansApprovalCount),
          newThreshold: Number(data.guardiansApprovalCount),
          executeAfter: Number(data.executeAfter),
          newOwners: data.newOwners,
        };
      } catch (e) {
        console.error(e);
        throw e;
      }
    },
    enabled:
      Boolean(addressToFetch) &&
      Boolean(publicClient?.transport.url) &&
      Boolean(srm),
    staleTime: 120000, // 2 minutes
    refetchOnMount: false, // Don't refetch when component mounts
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnReconnect: false, // Don't refetch when reconnecting
  });
}
