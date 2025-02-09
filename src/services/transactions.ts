"use client";

import { Address } from "viem";
import { SocialRecoveryModule, MetaTransaction } from "abstractionkit";
import { Result, ok, err } from "@/utils/result";

export interface Transaction {
  to: Address;
  data: `0x${string}`;
  value: bigint;
}

function formatTransaction(tx: MetaTransaction): Transaction {
  return {
    to: tx.to as Address,
    data: tx.data as `0x${string}`,
    value: tx.value ?? BigInt(0),
  };
}

/**
 * Builds a transaction to add guardians with a threshold
 */
export function buildAddGuardiansTransaction(
  srm: SocialRecoveryModule,
  signer: Address,
  guardians: Address[],
  threshold: number
): Result<Transaction[]> {
  try {
    const txs: Transaction[] = [];

    // Enable module if needed
    const enableModuleTx = srm.createEnableModuleMetaTransaction(signer);
    txs.push(formatTransaction(enableModuleTx));

    // Add guardians
    for (const guardian of guardians) {
      const addGuardianTx = srm.createAddGuardianWithThresholdMetaTransaction(
        guardian,
        BigInt(threshold)
      );
      txs.push(formatTransaction(addGuardianTx));
    }

    return ok(txs);
  } catch (error) {
    return err(String(error));
  }
}

/**
 * Builds a transaction to revoke guardians with a threshold
 */
export async function buildRevokeGuardiansTransaction(
  srm: SocialRecoveryModule,
  signer: Address,
  guardians: Address[],
  threshold: number,
  rpcUrl: string
): Promise<Result<Transaction[]>> {
  try {
    const txs: Transaction[] = [];

    // Revoke guardians
    for (const guardian of guardians) {
      const revokeGuardianTx =
        await srm.createRevokeGuardianWithThresholdMetaTransaction(
          rpcUrl,
          signer,
          guardian,
          BigInt(threshold)
        );
      txs.push(formatTransaction(revokeGuardianTx));
    }

    return ok(txs);
  } catch (error) {
    return err(String(error));
  }
}

/**
 * Builds a transaction to confirm recovery
 */
export function buildConfirmRecoveryTransaction(
  srm: SocialRecoveryModule,
  safeAddress: Address,
  newOwners: Address[],
  newThreshold: number,
  shouldExecute: boolean
): Result<Transaction> {
  try {
    const tx = srm.createConfirmRecoveryMetaTransaction(
      safeAddress,
      newOwners,
      newThreshold,
      shouldExecute
    );

    return ok(formatTransaction(tx));
  } catch (error) {
    return err(String(error));
  }
}

/**
 * Builds a transaction to execute recovery
 */
export function buildExecuteRecoveryTransaction(
  srm: SocialRecoveryModule,
  safeAddress: Address,
  newOwners: Address[],
  newThreshold: number
): Result<Transaction> {
  try {
    const tx = srm.createExecuteRecoveryMetaTransaction(
      safeAddress,
      newOwners,
      newThreshold
    );

    return ok(formatTransaction(tx));
  } catch (error) {
    return err(String(error));
  }
}

/**
 * Builds a transaction to finalize recovery
 */
export function buildFinalizeRecoveryTransaction(
  srm: SocialRecoveryModule,
  safeAddress: Address
): Result<Transaction> {
  try {
    const tx = srm.createFinalizeRecoveryMetaTransaction(safeAddress);
    return ok(formatTransaction(tx));
  } catch (error) {
    return err(String(error));
  }
}
