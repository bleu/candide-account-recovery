import { Address, isAddress } from "viem";

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

const baseUrl = "http://localhost:3000/manage-recovery/dashboard";

export const createFinalUrl = (params: RecoveryQueryParams): string => {
  const searchParams = new URLSearchParams();
  searchParams.append("safeAddress", params.safeAddress);
  searchParams.append("newOwners", params.newOwners.join(","));
  searchParams.append("newThreshold", params.newThreshold.toString());
  return `${baseUrl}?${searchParams.toString()}`;
};

export const recoverLinkParams = (linkParams: LinkParams) => {
  const safeAddress = linkParams.safeAddress as Address;
  const newOwners =
    linkParams?.newOwners !== undefined
      ? linkParams.newOwners.split(",")
      : undefined;
  const newThreshold =
    linkParams?.newThreshold !== undefined
      ? Number(linkParams.newThreshold)
      : undefined;
  const recoveryLink =
    safeAddress &&
    newOwners &&
    newThreshold &&
    validateLinkParams({ safeAddress, newOwners, newThreshold }).isValid
      ? createFinalUrl({ safeAddress, newOwners, newThreshold })
      : undefined;

  return { safeAddress, recoveryLink, newOwners, newThreshold };
};

export const validateLinkParams = ({
  safeAddress,
  newOwners,
  newThreshold,
}: RecoveryQueryParams): { isValid: boolean; reason: string } => {
  if (!isAddress(safeAddress))
    return { isValid: false, reason: "Safe address is not an address." };

  for (const owner of newOwners) {
    if (!isAddress(owner))
      return { isValid: false, reason: "One of the owners is not an address." };
  }

  if (newThreshold < 1 || newThreshold > newOwners.length)
    return {
      isValid: false,
      reason: "Threshold must be between 1 and number of owners.",
    };

  return { isValid: true, reason: "" };
};
