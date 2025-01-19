import { Address } from "viem";

type Guardians = { nickname: string; address: Address }[];

// Constants
const STORAGE_KEY = "candide-address-recovery:v1" as const;

const buildKey = (chainId: number, address: Address) => {
  return `${STORAGE_KEY}-${chainId}-${address.toLowerCase()}`;
};

// Check if window is defined (for SSR compatibility)
const isBrowser = typeof window !== "undefined";

export const storeGuardians = (
  guardians: Guardians,
  chainId: number,
  address: Address
) => {
  if (!isBrowser) return;

  try {
    localStorage.setItem(buildKey(chainId, address), JSON.stringify(guardians));
  } catch (e) {
    console.error("[storeGuardians] Error storing guardians:", e);
  }
};

export const getStoredGuardians = (
  chainId: number,
  address: Address
): Guardians => {
  if (!isBrowser) return [];

  try {
    const item = localStorage.getItem(buildKey(chainId, address));
    if (!item) return [];

    const guardians = JSON.parse(item) as Guardians;

    return guardians;
  } catch (e) {
    console.error("[getStoredGuardians] Error getting stored guardians:", e);
    return [];
  }
};
