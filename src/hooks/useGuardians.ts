"use client";

import { SocialRecoveryModule } from "abstractionkit";
import { useCallback, useEffect, useState } from "react";
import { useAccount, useClient } from "wagmi";
import { Address } from "viem";

export function useGuardians() {
  const client = useClient();
  const account = useAccount();
  const [guardians, setGuardians] = useState<Address[] | undefined>(undefined);
  const [error, setError] = useState<Error | null>(null);

  const listGuardians = useCallback(async () => {
    if (!account?.address || !client?.transport?.url) return undefined;
    try {
      const srm = new SocialRecoveryModule();
      const guardians = (await srm.getGuardians(
        client.transport.url,
        account.address
      )) as Address[];

      return guardians;
    } catch (e) {
      setError(new Error(`Error listing guardians: ${(e as Error).message}`));
      return undefined;
    }
  }, [account?.address, client?.transport?.url]);

  useEffect(() => {
    listGuardians().then((newGuardians) => setGuardians(newGuardians));
  }, [listGuardians]);

  return { guardians, error };
}
