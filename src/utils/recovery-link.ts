"use client";

export interface RecoveryQueryParams {
  safeAddress: string;
  newOwners: string[];
  newThreshold: number;
  chainId: string;
}

export type LinkParams = {
  safeAddress?: string;
  newOwners?: string;
  newThreshold?: string;
  chainId: string;
};

const isBrowser = typeof window !== "undefined";

export const createFinalUrl = (params: RecoveryQueryParams): string => {
  let baseUrl = "";
  if (isBrowser) {
    const protocol = window.location.protocol;
    const host = window.location.host;
    baseUrl = `${protocol}//${host}`;
  }

  const hashParams = new URLSearchParams();
  hashParams.append("safeAddress", params.safeAddress);
  hashParams.append("newOwners", params.newOwners.join(","));
  hashParams.append("newThreshold", params.newThreshold.toString());
  hashParams.append("chainId", params.chainId);

  return `${baseUrl}/manage-recovery/dashboard#${hashParams.toString()}`;
};

export const isValidLink = (link: string): boolean => {
  try {
    // Check if the link has a hash part
    const hashPart = link.split("#")[1];
    if (!hashPart) return false;

    // Parse the hash parameters
    const hashParams = new URLSearchParams(hashPart);

    // Required parameters
    const safeAddress = hashParams.get("safeAddress");
    const newOwnersStr = hashParams.get("newOwners");
    const newThresholdStr = hashParams.get("newThreshold");
    const chainId = hashParams.get("chainId");

    // Check if all required parameters exist
    if (!safeAddress || !newOwnersStr || !newThresholdStr || !chainId) {
      return false;
    }

    // Validate newOwners format
    const newOwners = newOwnersStr.split(",");
    if (newOwners.length === 0) {
      return false;
    }

    // Validate newThreshold
    const newThreshold = parseInt(newThresholdStr, 10);
    if (
      isNaN(newThreshold) ||
      newThreshold <= 0 ||
      newThreshold > newOwners.length
    ) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error validating link:", error);
    return false;
  }
};
