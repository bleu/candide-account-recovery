"use client";

export interface RecoveryQueryParams {
  safeAddress: string;
  newOwners: string[];
  newThreshold: number;
}

export type LinkParams = {
  safeAddress?: string;
  newOwners?: string;
  newThreshold?: string;
};

export const createFinalUrl = (params: RecoveryQueryParams): string => {
  const baseUrl = window !== undefined && window.location.host;
  const hashParams = new URLSearchParams();
  hashParams.append("safeAddress", params.safeAddress);
  hashParams.append("newOwners", params.newOwners.join(","));
  hashParams.append("newThreshold", params.newThreshold.toString());
  return `http://${baseUrl}/manage-recovery/dashboard#${hashParams.toString()}`;
};
