"use client";

import { Address } from "viem";
import { Guardian } from "@/components/guardian-list";

// Constants
const STORAGE_KEY = "candide-address-recovery:v1" as const;

const buildKey = (chainId: number, address: Address) => {
  return `${STORAGE_KEY}-${chainId}-${address.toLowerCase()}`;
};

export const storeGuardians = (
  guardians: Guardian[],
  chainId: number,
  address: Address
) => {
  try {
    localStorage.setItem(buildKey(chainId, address), JSON.stringify(guardians));
  } catch (e) {
    console.error("[storeGuardians] Error storing guardians:", e);
  }
};

export const getStoredGuardians = (
  chainId: number,
  address: Address
): Guardian[] => {
  try {
    const item = localStorage.getItem(buildKey(chainId, address));
    if (!item) return [];

    const guardians = JSON.parse(item) as Guardian[];

    return guardians;
  } catch (e) {
    console.error("[getStoredGuardians] Error getting stored guardians:", e);
    return [];
  }
};
