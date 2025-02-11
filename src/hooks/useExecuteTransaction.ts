"use client";

import { useEffect, useState } from "react";
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
  const [txHashes, setTxHashes] = useState<string[]>([]);

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
      setTxHashes(newTxHashes);
    },
  });

  useEffect(() => {
    if (txHashes.length > 0) {
      if (onSuccess) onSuccess();
      setTxHashes([]);
      mutation.reset();
    }
  }, [txHashes, onSuccess, mutation]);

  useEffect(() => {
    if (mutation?.error)
      toast({
        title: "Error executing transaction.",
        description: getReadableError(mutation?.error),
        isWarning: true,
      });
    if (onError && mutation?.error) onError(mutation?.error);
  }, [mutation?.error, onError]);

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
