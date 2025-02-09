"use client";

import { useCallback } from "react";
import { isAddress } from "viem";
import { useGuardians } from "./useGuardians";
import { Result, ok, err } from "@/utils/result";

/**
 * Hook that provides owner validation with current state from the blockchain
 * Returns a validation function in the format expected by NewAddressList
 *
 * @param safeAddress - The address of the safe being recovered
 * @returns A validation function that checks if an address can be added as a new owner
 */
export function useValidateNewOwner(safeAddress: string) {
  const { data: guardians } = useGuardians(safeAddress as `0x${string}`);

  return useCallback(
    (address: string): Result<true> => {
      if (!isAddress(address)) {
        return err("Insert a valid address.");
      }

      if (address === safeAddress) {
        return err("This safe address can't be an owner.");
      }

      if (!guardians) {
        return err("Couldn't fetch guardians.");
      }

      if (guardians.includes(address)) {
        return err("Guardians can't be new owners.");
      }

      return ok(true as const);
    },
    [safeAddress, guardians]
  );
}
