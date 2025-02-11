"use client";

import { usePublicClient } from "wagmi";
import { useQuery } from "@tanstack/react-query";

export function useWaitTxReceipt(txHash: string | string[] | undefined) {
  const publicClient = usePublicClient();

  return useQuery({
    queryKey: ["txHash", txHash],
    queryFn: async () => {
      if (!txHash || !publicClient)
        throw new Error("Missing txHash or publicClient");

      const hashes = Array.isArray(txHash) ? txHash : [txHash];

      if (hashes.length === 0)
        throw new Error("No tx hash to wait for receipt");

      const receipts = await Promise.all(
        hashes.map((hash: string) =>
          publicClient.waitForTransactionReceipt({
            hash: hash as `0x${string}`,
          })
        )
      );
      return receipts;
    },
    enabled:
      Boolean(txHash) &&
      Boolean(txHash && (typeof txHash === "string" || txHash.length > 0)) &&
      Boolean(publicClient),
    refetchInterval: (data) => (!data ? 1000 : false), // Poll until receipt is found
  });
}
