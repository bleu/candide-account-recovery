"use client";

import { useSocialRecoveryModule } from "./use-social-recovery-module";
import { useAccount, usePublicClient } from "wagmi";
import { Address } from "viem";
import { useQuery } from "@tanstack/react-query";
import { safeWalletAbi } from "@/utils/abis/safeWalletAbi";
import { socialRecoveryModuleAbi } from "@/utils/abis/socialRecoveryModuleAbi";

export interface RecoveryInfo {
  guardiansApprovalCount: number;
  newThreshold: number;
  executeAfter: number;
  newOwners: readonly Address[];
}

export interface SrmData {
  owners?: Address[];
  safeThreshold?: number;
  guardians?: Address[];
  recoveryInfo?: RecoveryInfo;
  threshold?: number;
}

export function useSrmData(safeAddress?: Address, chainId?: number) {
  const { address, chainId: accountChainId } = useAccount();
  const { srm } = useSocialRecoveryModule({ safeAddress, chainId });

  const chainIdToFetch = chainId ?? accountChainId;
  const addressToFetch = safeAddress ?? address;

  const publicClient = usePublicClient({ chainId: chainIdToFetch });

  const query = useQuery<SrmData>({
    queryKey: ["guardians", chainIdToFetch, addressToFetch, srm?.moduleAddress],
    queryFn: async () => {
      if (!addressToFetch || !publicClient) {
        throw new Error("Account, srm or client not available");
      }

      const safeWalletCalls = [
        {
          address: addressToFetch,
          abi: safeWalletAbi,
          functionName: "getOwners",
        },
        {
          address: addressToFetch,
          abi: safeWalletAbi,
          functionName: "getThreshold",
        },
      ];

      if (!srm) {
        const results = await publicClient.multicall({
          contracts: safeWalletCalls,
        });

        const output = {} as SrmData;

        if (results[0].status === "success")
          output.owners = results[0].result as Address[];
        if (results[1].status === "success")
          output.safeThreshold = Number(results[1].result);
        output.guardians = [];
        return output;
      }

      const results = await publicClient.multicall({
        contracts: [
          {
            address: addressToFetch,
            abi: safeWalletAbi,
            functionName: "getOwners",
          },
          {
            address: addressToFetch,
            abi: safeWalletAbi,
            functionName: "getThreshold",
          },
          {
            address: srm.moduleAddress as Address,
            abi: socialRecoveryModuleAbi,
            functionName: "getGuardians",
            args: [addressToFetch],
          },
          {
            address: srm.moduleAddress as Address,
            abi: socialRecoveryModuleAbi,
            functionName: "threshold",
            args: [addressToFetch],
          },
          {
            address: srm.moduleAddress as Address,
            abi: socialRecoveryModuleAbi,
            functionName: "getRecoveryRequest",
            args: [addressToFetch],
          },
        ],
      });

      const output = {} as SrmData;

      if (results[0].status === "success")
        output.owners = results[0].result as Address[];
      if (results[1].status === "success")
        output.safeThreshold = Number(results[1].result);
      if (results[2].status === "success")
        output.guardians = results[2].result as Address[];
      if (results[3].status === "success")
        output.threshold = Number(results[3].result);
      if (results[4].status === "success")
        output.recoveryInfo = {
          guardiansApprovalCount: Number(
            results[4].result.guardiansApprovalCount
          ),
          newThreshold: Number(results[4].result.guardiansApprovalCount),
          executeAfter: Number(results[4].result.executeAfter),
          newOwners: results[4].result.newOwners,
        } as RecoveryInfo;

      return output;
    },
    structuralSharing: false,
    enabled: Boolean(addressToFetch) && Boolean(publicClient),
  });

  return query.data ?? {};
}
