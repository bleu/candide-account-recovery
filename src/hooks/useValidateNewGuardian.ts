"use client";

import { useCallback } from "react";
import { isAddress } from "viem";
import { useGuardians } from "./useGuardians";
import { useOwners } from "./useOwners";

export function useValidateNewGuardian() {
  const { data: guardians } = useGuardians();
  const { data: owners } = useOwners();

  const validateNewGuardian = useCallback(
    (newGuardian: string, currentGuardians: string[]) => {
      // 1. Must be a valid address
      if (!isAddress(newGuardian))
        return { isValid: false, reason: "Invalid address." };

      // 2. Can't be already included
      if (currentGuardians.includes(newGuardian))
        return {
          isValid: false,
          reason: "Repeated guardians are not allowed.",
        };

      // 3. Can't be an owner
      if (owners === undefined)
        throw new Error("[validateNewGuardian] missing owners");
      if (owners.includes(newGuardian))
        return { isValid: false, reason: "Owners can't be guardians." };

      // 4. Can't be a guardian
      if (guardians === undefined)
        throw new Error("[validateNewGuardian] missing guardians");
      if (guardians.includes(newGuardian))
        return {
          isValid: false,
          reason: "This address is already a guardian.",
        };

      return { isValid: true, reason: "" };
    },
    [owners, guardians]
  );

  return validateNewGuardian;
}
