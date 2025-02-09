"use client";

import { Address, isAddress } from "viem";
import { Result, err, ok } from "@/utils/result";

export type { Result };

export type ValidationErrorCode =
  | "INVALID_ADDRESS"
  | "DUPLICATE_GUARDIAN"
  | "IS_OWNER"
  | "ALREADY_GUARDIAN"
  | "MISSING_PARAMETER"
  | "INVALID_THRESHOLD";

export interface ValidationError {
  code: ValidationErrorCode;
  message: string;
}

/**
 * Validates if an address can be added as a guardian
 */
export function validateNewGuardian(
  newGuardian: string,
  currentGuardians: string[],
  owners: Address[],
  existingGuardians: Address[]
): Result<true> {
  // 1. Must be a valid address
  if (!isAddress(newGuardian)) {
    return err("Invalid address.");
  }

  // 2. Can't be already included in current session
  if (currentGuardians.includes(newGuardian)) {
    return err("Repeated guardians are not allowed.");
  }

  // 3. Can't be an owner
  if (owners.includes(newGuardian)) {
    return err("Owners can't be guardians.");
  }

  // 4. Can't be a guardian already
  if (existingGuardians.includes(newGuardian)) {
    return err("This address is already a guardian.");
  }

  return ok(true as const);
}

/**
 * Validates recovery parameters
 */
export function validateRecoveryParams(
  safeAddress: Address | undefined,
  newOwners: Address[] | undefined,
  newThreshold: number | undefined
): Result<{
  safeAddress: Address;
  newOwners: Address[];
  newThreshold: number;
}> {
  if (!safeAddress) {
    return err("Safe address is required");
  }

  if (!newOwners?.length) {
    return err("New owners are required");
  }

  if (!newThreshold || newThreshold <= 0) {
    return err("Threshold must be greater than 0");
  }

  return ok({
    safeAddress,
    newOwners,
    newThreshold,
  });
}

/**
 * Validates a list of addresses
 */
export function validateAddresses(addresses: unknown[]): Result<Address[]> {
  if (!Array.isArray(addresses) || addresses.length === 0) {
    return err("At least one address is required");
  }

  for (const address of addresses) {
    if (!address || typeof address !== "string" || !isAddress(address)) {
      return err("Invalid address in list");
    }
  }

  return ok(addresses as Address[]);
}

/**
 * Validates a threshold value
 */
export function validateThreshold(
  threshold: number | undefined
): Result<number> {
  if (typeof threshold !== "number" || threshold <= 0) {
    return err("Threshold must be greater than 0");
  }

  return ok(threshold);
}

export function validateRecoveryRequest(
  safeAddress: unknown,
  newOwners: unknown[],
  newThreshold: unknown
): Result<{
  safeAddress: Address;
  newOwners: Address[];
  newThreshold: number;
}> {
  if (
    !safeAddress ||
    typeof safeAddress !== "string" ||
    !isAddress(safeAddress)
  ) {
    return err("Invalid safe address");
  }

  const validatedAddresses = validateAddresses(newOwners);
  if (!validatedAddresses.success) {
    return validatedAddresses;
  }

  const validatedThreshold = validateThreshold(
    typeof newThreshold === "number" ? newThreshold : undefined
  );
  if (!validatedThreshold.success) {
    return validatedThreshold;
  }

  return ok({
    safeAddress: safeAddress as Address,
    newOwners: validatedAddresses.value,
    newThreshold: validatedThreshold.value,
  });
}

/**
 * Validates if an address can be added as a guardian, checking against current blockchain state
 */
export function validateGuardianWithState(
  newGuardian: string,
  currentGuardians: string[],
  owners: Address[] | undefined,
  existingGuardians: Address[] | undefined
): Result<true> {
  if (!owners || !existingGuardians) {
    return err("Cannot validate guardian: missing blockchain state");
  }

  return validateNewGuardian(
    newGuardian,
    currentGuardians,
    owners,
    existingGuardians
  );
}
