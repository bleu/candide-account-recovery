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
