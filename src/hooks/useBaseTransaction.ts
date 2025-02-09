import { Address } from "viem";
import { useAccount, useWalletClient } from "wagmi";
import { useMutation } from "@tanstack/react-query";
import { getReadableError } from "@/utils/get-readable-error";
import { useState } from "react";

export interface Transaction {
  to: string;
  data: string;
  value?: bigint;
}

export interface BaseTransactionResult<TState extends string> {
  txHash: string | null;
  error: string | null;
  isLoading: boolean;
  state: TState;
  mutation: {
    mutate: () => void;
    mutateAsync: () => Promise<string>;
  };
}

interface UseBaseTransactionOptions<TState extends string> {
  initialState: TState;
  onStateChange: (state: TState) => void;
  transformTransaction?: (tx: Transaction) => Promise<Transaction>;
  validateWallet?: () => Promise<boolean>;
}

export function useBaseTransaction<TState extends string>(
  buildTransaction: () => Promise<Transaction | Transaction[]>,
  options: UseBaseTransactionOptions<TState>
): BaseTransactionResult<TState> {
  const { address: signer } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [transactionState, setTransactionState] = useState<TState>(
    options.initialState
  );

  const updateState = (newState: TState) => {
    setTransactionState(newState);
    options.onStateChange(newState);
  };

  const mutation = useMutation({
    mutationFn: async () => {
      if (!signer || !walletClient) {
        throw new Error("Wallet not connected");
      }

      if (options.validateWallet) {
        const isValid = await options.validateWallet();
        if (!isValid) {
          updateState("failed" as TState);
          throw new Error("Invalid wallet type for this transaction");
        }
      }

      try {
        updateState("preparing" as TState);
        const txs = await buildTransaction();
        const transactions = Array.isArray(txs) ? txs : [txs];

        if (transactions.length !== 1) {
          updateState("failed" as TState);
          throw new Error("Transactions must be executed one at a time");
        }

        let tx = transactions[0];
        if (options.transformTransaction) {
          tx = await options.transformTransaction(tx);
        }

        updateState("executing" as TState);
        const hash = await walletClient.sendTransaction({
          to: tx.to as Address,
          data: tx.data as `0x${string}`,
          value: tx.value || BigInt(0),
        });

        updateState("success" as TState);
        return hash;
      } catch (error: unknown) {
        if (
          typeof error === "object" &&
          error !== null &&
          ("code" in error || "message" in error)
        ) {
          const txError = error as { code?: number; message?: string };

          if (txError.code === 4001 || txError.message?.includes("reject")) {
            updateState("failed" as TState);
            throw new Error("Transaction rejected by user");
          }
        }

        updateState("failed" as TState);
        throw error;
      }
    },
  });

  return {
    mutation: {
      mutate: () => mutation.mutate(),
      mutateAsync: () => mutation.mutateAsync(),
    },
    txHash: mutation.data ?? null,
    error: mutation.error ? getReadableError(mutation.error) : null,
    isLoading: mutation.isPending,
    state: transactionState,
  };
}
