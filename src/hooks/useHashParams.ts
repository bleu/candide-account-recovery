"use client";

import { useEffect, useState } from "react";
import type { Address } from "viem";

const isBrowser = typeof window !== "undefined";

type RecoveryParams = {
  safeAddress: Address | undefined;
  newOwners: Address[] | undefined;
  newThreshold: number | undefined;
  chainId: number | undefined;
  recoveryLink: string | undefined;
};

function useHashParams(): RecoveryParams {
  const [params, setParams] = useState<RecoveryParams>({} as RecoveryParams);

  useEffect(() => {
    if (!isBrowser) return;

    const hash = window.location.hash.substring(1);
    const result = {} as RecoveryParams;

    if (!hash) {
      setParams(result);
      return;
    }

    const pairs = hash.split("&");
    for (const pair of pairs) {
      const [key, value] = pair.split("=");
      if (key === "safeAddress" && value) {
        result.safeAddress = value as Address;
      }
      if (key === "newOwners" && value) {
        result.newOwners = value.split(",") as Address[];
      }
      if (key === "newThreshold" && value) {
        result.newThreshold = Number(value);
      }
      if (key === "chainId" && value) {
        result.chainId = Number(value);
      }
    }

    result.recoveryLink =
      result.safeAddress && result.newOwners && result.newThreshold
        ? window.location.href
        : undefined;

    setParams(result);
  }, []);

  return params;
}

export default useHashParams;
