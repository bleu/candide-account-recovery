import { Address } from "viem";

export interface TransactionResult {
  /** Execute the transaction */
  execute: () => void;
  /** Array of transaction hashes from executed transactions */
  txHashes: string[];
  /** Human readable error message if any */
  error: string | null;
  /** Whether the transaction is currently being processed */
  isLoading: boolean;
}

export interface GuardianManagementParams {
  guardians: Address[];
  threshold?: number;
}

export interface RecoveryParams {
  safeAddress: Address;
  newOwners: Address[];
  newThreshold: number;
}

export interface RecoveryConfirmationParams extends RecoveryParams {
  shouldExecute?: boolean;
}
