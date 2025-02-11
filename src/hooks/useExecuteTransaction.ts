"use client";

import { useAccount, useWalletClient } from "wagmi";
import { Address } from "viem";
import { useMutation } from "@tanstack/react-query";
import { toast } from "./use-toast";
import { getReadableError } from "@/utils/get-readable-error";

interface BaseTx {
  to: Address;
  value: bigint;
  data: `0x${string}`;
}

export function useExecuteTransaction({
  buildTxFn,
  onSuccess,
  onError,
}: {
  buildTxFn: () => BaseTx[] | Promise<BaseTx[]>;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const { address: signer } = useAccount();
  const { data: walletClient } = useWalletClient();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!signer) throw new Error("Missing signer");
      if (!walletClient) throw new Error("Missing wallet client");

      const txs = await buildTxFn();

      if (txs.length < 1) throw new Error("No transaction to call");

      const newTxHashes = [] as `0x${string}`[];
      for (const tx of txs) {
        const txHash = await walletClient.sendTransaction(tx);
        newTxHashes.push(txHash);
      }
      return newTxHashes;
    },
    onSuccess: () => {
      if (onSuccess) onSuccess();
      mutation.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error executing transaction.",
        description: getReadableError(error),
        isWarning: true,
      });
      if (onError) onError(error);
    },
  });

  const trigger = () => {
    if (signer && walletClient) {
      mutation.mutate();
    }
  };

  return {
    trigger,
    isLoading: mutation.isPending,
    loadingMessage: "Waiting for transaction approval...",
  };
}
