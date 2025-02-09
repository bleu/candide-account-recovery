import { Address } from "viem";

export const queryKeys = {
  moduleEnabled: (address?: Address) => ["moduleEnabled", address],
  guardians: (address?: Address) => ["guardians", address],
  owners: (address?: Address) => ["owners", address],
  recoveryInfo: (address?: Address) => ["recoveryInfo", address],
  approvalsInfo: (params: {
    safeAddress?: Address;
    newOwners?: Address[];
    newThreshold?: number;
  }) => ["approvalsInfo", params],
} as const;
