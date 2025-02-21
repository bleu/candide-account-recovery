"use client";

import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { Address } from "viem";
import { useMutation } from "@tanstack/react-query";
import { toast } from "./use-toast";
import { getReadableError } from "@/utils/get-readable-error";
import { useIsSafeAccount } from "./use-is-safe-account";
import { useWaitNextSafeAccountTx } from "./use-wait-next-safe-account-tx";
import { useState } from "react";
import { eip5792Actions } from "viem/experimental";

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
  const [isWaitingApproval, setIsWaitingApproval] = useState<boolean>(false);
  const [isWaitingTx, setIsWaitingTx] = useState<boolean>(false);

  const { address: signer } = useAccount();
  const { data: rawWalletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { isSafeAccount } = useIsSafeAccount();
  const { waitNextSafeAccountTx, cancel: cancelWaitSafeTx } =
    useWaitNextSafeAccountTx({
      safeAddress: signer,
    });

  const walletClient = rawWalletClient?.extend(eip5792Actions());

  const mutation = useMutation({
    mutationFn: async () => {
      if (!signer) throw new Error("Missing signer");
      if (!walletClient) throw new Error("Missing wallet client");

      const txs = await buildTxFn();

      if (txs.length < 1) throw new Error("No transaction to call");

      setIsWaitingApproval(true);
      const newTxHash =
        txs.length > 1
          ? await walletClient.sendCalls({ calls: txs })
          : await walletClient.sendTransaction(txs[0]);
      setIsWaitingApproval(false);
      setIsWaitingTx(true);
      if (isSafeAccount) {
        const successfulTx = await waitNextSafeAccountTx();
        if (!successfulTx) throw new Error("Timeout waiting for tx execution.");
      } else {
        await publicClient?.waitForTransactionReceipt({
          hash: newTxHash as `0x${string}`,
        });
      }
      setIsWaitingTx(false);
      return [newTxHash];
    },
    onSuccess: () => {
      if (onSuccess) onSuccess();
      setIsWaitingApproval(false);
      setIsWaitingTx(false);
      mutation.reset();
    },
    onError: (error: Error) => {
      setIsWaitingApproval(false);
      setIsWaitingTx(false);
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

  const cancel = () => {
    mutation.reset();
    if (isSafeAccount) cancelWaitSafeTx();
  };

  return {
    trigger,
    isLoading: mutation.isPending,
    loadingMessage: getLoadingMessage(
      isWaitingApproval,
      isWaitingTx,
      isSafeAccount
    ),
    cancel,
  };
}

const getLoadingMessage = (
  isWaitingApproval: boolean,
  isWaitingTx: boolean,
  isSafeAccount: boolean
) => {
  if (isWaitingApproval && isSafeAccount)
    return "Waiting for someone to accept the transaction...";
  if (isWaitingApproval && !isSafeAccount) return "Confirming transaction...";
  if (isWaitingTx && isSafeAccount)
    return "Waiting for transaction execution on safe wallet manager...";
  if (isWaitingTx && !isSafeAccount)
    return "Waiting for transaction exectution...";
  return "Loading transaction...";
};
