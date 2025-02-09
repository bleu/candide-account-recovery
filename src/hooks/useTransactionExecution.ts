"use client";

import { useAccount } from "wagmi";
import {
  useEoaTransaction,
  type EoaTransactionState,
} from "./useEoaTransaction";
import {
  useSafeTransaction,
  type SafeTransactionState,
} from "./useSafeTransaction";
import { useSafeDetection } from "./useSafeDetection";

interface Transaction {
  to: string;
  data: string;
  value?: bigint;
}

export type TransactionState = EoaTransactionState | SafeTransactionState;

interface TransactionResult {
  txHash: string | null;
  error: string | null;
  isLoading: boolean;
  state: TransactionState;
  mutation: {
    mutate: () => void;
    mutateAsync: () => Promise<string>;
  };
}

/**
 * Hook for executing transactions that works with both EOA and Safe wallets
 * This is a composition helper that uses either useEoaTransaction or useSafeTransaction
 * based on the context
 *
 * @param buildTransaction - Function to build the transaction
 * @returns Transaction execution result that works for both EOA and Safe wallets
 */
export function useTransactionExecution(
  buildTransaction: () => Promise<Transaction | Transaction[]>
): TransactionResult {
  const { address } = useAccount();
  const { isSafeWallet } = useSafeDetection();

  // Always call both hooks to satisfy React's rules, but only use the result from the appropriate one
  const eoaResult = useEoaTransaction(buildTransaction);
  const safeResult = useSafeTransaction(buildTransaction);

  // Return Safe result if we have a connected wallet and it's a Safe wallet
  // Otherwise return EOA result
  return address && isSafeWallet ? safeResult : eoaResult;
}
