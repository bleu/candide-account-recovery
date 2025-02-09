"use client";

import { useCallback } from "react";
import { useGuardians } from "./useGuardians";
import { useOwners } from "./useOwners";
import { validateNewGuardian } from "@/services/validation";
import { Result } from "@/utils/result";

/**
 * Hook that provides guardian validation with current state from the blockchain
 * Returns a validation function in the format expected by NewAddressList
 *
 * @returns A validation function that checks if an address can be added as a guardian
 * @example
 * ```tsx
 * const validateAddress = useValidateNewGuardian(currentGuardians);
 * const result = validateAddress("0x...");
 * if (!result.success) {
 *   console.error(result.error);
 * }
 * ```
 */
export function useValidateNewGuardian(guardians: string[]) {
  const { data: existingGuardians } = useGuardians();
  const { data: owners } = useOwners();

  return useCallback(
    (address: string): Result<true> => {
      if (!owners || !existingGuardians) {
        return {
          success: false,
          error: "Cannot validate guardian: missing blockchain state",
        };
      }

      return validateNewGuardian(address, guardians, owners, existingGuardians);
    },
    [owners, existingGuardians, guardians]
  );
}
