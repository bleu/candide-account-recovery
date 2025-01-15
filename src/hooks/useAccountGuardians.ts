"use client";

import { SocialRecoveryModule } from "abstractionkit";
import { useCallback } from "react";
import { useAccount, useClient } from "wagmi";
import useSWR from "swr";

export function useAccountGuardians() {
  const client = useClient();
  const account = useAccount();

  const listGuardians = useCallback(async () => {
    if (!account?.address || !client?.transport?.url) return [];

    const srm = new SocialRecoveryModule();
    const guardians = await srm.getGuardians(
      client.transport.url,
      account.address
    );

    return guardians;
  }, [account?.address, client?.transport?.url]);

  return useSWR(
    account?.address && client?.transport?.url ? "guardians" : null,
    listGuardians,
    {
      revalidateOnFocus: false,
      refreshInterval: 0,
      shouldRetryOnError: false,
    }
  );
}
