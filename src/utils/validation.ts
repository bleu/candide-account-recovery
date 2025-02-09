import { Address, isAddress } from "viem";
import { Result, ok, err, combine } from "./result";

export function validateAddress(address: unknown): Result<Address> {
  if (!address || typeof address !== "string" || !isAddress(address)) {
    return err("Invalid address");
  }
  return ok(address as Address);
}

export function validateAddresses(addresses: unknown[]): Result<Address[]> {
  if (!Array.isArray(addresses) || addresses.length === 0) {
    return err("At least one address is required");
  }

  const results = addresses.map(validateAddress);
  const combined = combine(results);
  if (!combined.success) return combined;

  return ok(addresses as Address[]);
}

export function validateThreshold(
  threshold: number | undefined
): Result<number> {
  if (typeof threshold !== "number" || threshold <= 0) {
    return err("Threshold must be greater than 0");
  }
  return ok(threshold);
}

export interface RecoveryParams {
  safeAddress: Address;
  newOwners: Address[];
  newThreshold: number;
}

export function validateRecoveryParams(
  safeAddress: Address | undefined,
  newOwners: Address[] | undefined,
  newThreshold: number | undefined
): Result<RecoveryParams> {
  const addressResult = validateAddress(safeAddress);
  if (!addressResult.success) return addressResult;

  const ownersResult = validateAddresses(newOwners || []);
  if (!ownersResult.success) return ownersResult;

  const thresholdResult = validateThreshold(newThreshold);
  if (!thresholdResult.success) return thresholdResult;

  return ok({
    safeAddress: addressResult.value,
    newOwners: ownersResult.value,
    newThreshold: thresholdResult.value,
  });
}
