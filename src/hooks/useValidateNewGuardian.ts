"use client";

import { useCallback } from "react";
import { isAddress } from "viem";
import { useGuardians } from "./useGuardians";
import { useOwners } from "./useOwners";

export function useValidateNewGuardian() {
  const { guardians } = useGuardians();
  const { owners } = useOwners();

  const validateNewGuardian = useCallback(
    (newGuardian: string, currentGuardians: string[]) => {
      console.log({
        newGuardian,
        isAddress: isAddress(newGuardian),
        owners,
        guardians,
      });

      // 1. Must be a valid address
      if (!isAddress(newGuardian)) return false;

      // 2. Can't be already included
      if (currentGuardians.includes(newGuardian)) return false;

      // 3. Can't be an owner
      if (owners === undefined)
        throw new Error("[validateNewGuardian] missing owners");
      if (owners.includes(newGuardian)) return false;

      // 4. Can't be a guardian
      if (guardians === undefined)
        throw new Error("[validateNewGuardian] missing guardians");
      if (guardians.includes(newGuardian)) return false;

      return true;
    },
    [owners, guardians]
  );

  return validateNewGuardian;
}
