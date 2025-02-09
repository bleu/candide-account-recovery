"use client";

import { usePublicClient } from "wagmi";
import { useQuery } from "@tanstack/react-query";

export function useTransactionStatus(txHash?: string) {
  const publicClient = usePublicClient();

  return useQuery({
    queryKey: ["txStatus", txHash],
    queryFn: async () => {
      if (!txHash || !publicClient) return null;
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: txHash as `0x${string}`,
      });
      return receipt;
    },
    enabled: Boolean(txHash) && Boolean(publicClient),
    refetchInterval: (data) => (!data ? 1000 : false), // Poll until receipt is found
  });
}
