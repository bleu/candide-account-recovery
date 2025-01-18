"use client";

import { SafeAccountV0_3_0 } from "abstractionkit";
import { useCallback, useEffect, useState } from "react";
import { useAccount, useClient } from "wagmi";
import { Address } from "viem";

export function useOwners() {
  const client = useClient();
  const account = useAccount();
  const [owners, setOwners] = useState<Address[] | undefined>(undefined);
  const [error, setError] = useState<Error | null>(null);

  const listOwners = useCallback(async () => {
    if (!account?.address || !client?.transport?.url) return undefined;

    try {
      const safeAccount = new SafeAccountV0_3_0(account.address);
      const owners = (await safeAccount.getOwners(
        client.transport.url
      )) as Address[];
      return owners;
    } catch (e) {
      setError(new Error(`Error listing owners: ${(e as Error).message}`));
      return undefined;
    }
  }, [account?.address, client?.transport?.url]);

  useEffect(() => {
    listOwners().then((newOwners) => setOwners(newOwners));
  }, [listOwners]);

  return { owners, error };
}
