import { Address, type WalletClient } from "viem";
import type { TransactionState } from "@/hooks/useTransactionExecution";

export interface MetaTransaction {
  to: Address;
  data: `0x${string}`;
  value: bigint;
}

export interface RawMetaTransaction {
  to: string;
  data: string;
  value: bigint;
}

export function formatMetaTransaction(tx: RawMetaTransaction): MetaTransaction {
  return {
    to: tx.to as Address,
    data: tx.data as `0x${string}`,
    value: tx.value,
  };
}

/**
 * Get user-friendly loading text for transaction states
 * @param state - Current transaction state
 * @param action - Optional action name to customize the message (e.g., "canceling", "adding guardian")
 */
export function getTransactionLoadingText(
  state: TransactionState,
  action?: string
): string {
  const defaultAction = action ?? "transaction";

  switch (state) {
    case "idle":
      return `Preparing ${defaultAction}...`;
    case "preparing":
      return "Preparing transaction...";
    case "awaitingSignature":
      return "Please sign the transaction in your wallet...";
    case "proposingToSafe":
      return "Proposing transaction to Safe...";
    case "awaitingConfirmations":
      return "Waiting for confirmations from other owners...";
    case "executing":
      return action ? `${action}...` : "Executing transaction...";
    case "success":
      return action ? `${action} successful!` : "Transaction successful!";
    case "reverted":
      return "Transaction reverted";
    case "failed":
      return "Transaction failed";
    default:
      return "Processing transaction...";
  }
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateThreshold(
  threshold: number | undefined
): ValidationResult {
  if (!threshold || threshold <= 0) {
    return { isValid: false, error: "Threshold must be greater than 0" };
  }
  return { isValid: true };
}

export function validateGuardians(
  guardians: Address[] | undefined
): ValidationResult {
  if (!guardians?.length) {
    return { isValid: false, error: "No guardians provided" };
  }
  return { isValid: true };
}

export function validateRecoveryParams(
  safeAddress?: Address,
  newOwners?: Address[],
  newThreshold?: number
): ValidationResult {
  if (!safeAddress) {
    return { isValid: false, error: "Safe address is required" };
  }
  if (!newOwners?.length) {
    return { isValid: false, error: "New owners are required" };
  }
  return validateThreshold(newThreshold);
}

export async function executeBatchTransactions(
  txs: MetaTransaction[],
  walletClient: WalletClient
): Promise<string[]> {
  if (txs.length < 1) throw new Error("No transaction to call");
  if (!walletClient.account) throw new Error("No account connected");

  const txHashes = [];
  for (const tx of txs) {
    const hash = await walletClient.sendTransaction({
      to: tx.to,
      data: tx.data,
      value: tx.value,
      account: walletClient.account,
      chain: walletClient.chain,
    });
    txHashes.push(hash);
  }
  return txHashes;
}
