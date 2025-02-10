"use client";

import { useCallback, useEffect, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { Address } from "viem";
import { useMutation } from "@tanstack/react-query";
import { useWaitTxReceipt } from "./useWaitTxReceipt";

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
  onError?: () => void;
}) {
  const { address: signer } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [txHashes, setTxHashes] = useState<string[]>([]);

  const { isLoading: isWaitingForReceipt, error: errorWaitingReceipt } =
    useWaitTxReceipt(txHashes);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!signer) throw new Error("Missing signer");
      if (!walletClient) throw new Error("Missing wallet client");

      const txs = await buildTxFn();

      if (txs.length < 1) throw new Error("No transaction to call");

      const newTxHashes = [];
      for (const tx of txs) {
        const txHash = await walletClient.sendTransaction(tx);
        newTxHashes.push(txHash);
      }
      setTxHashes(newTxHashes);
    },
  });

  const reset = useCallback(() => {
    setTxHashes([]);
    mutation.reset();
  }, [mutation]);

  useEffect(() => {
    if (!isWaitingForReceipt && txHashes) {
      reset();
      if (onSuccess) onSuccess();
    }
  }, [isWaitingForReceipt, txHashes, onSuccess, reset]);

  useEffect(() => {
    if (onError && (errorWaitingReceipt || mutation?.error)) onError();
  }, [errorWaitingReceipt, mutation?.error, onError]);

  const trigger = () => {
    if (signer && walletClient) {
      mutation.mutate();
    }
  };

  const getLoadingMessage = () => {
    if (mutation.isPending) return "Waiting for signatures";
    if (isWaitingForReceipt) return "Waiting for order execution";
    return "";
  };

  return {
    trigger,
    isLoading: mutation.isPending || isWaitingForReceipt,
    loadingMessage: getLoadingMessage(),
  };
}
