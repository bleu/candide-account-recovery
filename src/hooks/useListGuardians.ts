"use client";

import { SocialRecoveryModule, SafeAccountV0_3_0 } from "abstractionkit";
import { useCallback, useEffect, useState } from "react";
import { useAccount, useClient } from "wagmi";
import { Address } from "viem";

export function useSafeAddressInfo() {
  const client = useClient();
  const account = useAccount();

  const [owners, setOwners] = useState<Address[] | undefined>(undefined);
  const [guardians, setGuardians] = useState<Address[] | undefined>(undefined);
  const [errors, setErrors] = useState<Error[]>([]);

  const listGuardians = useCallback(async () => {
    if (!account?.address || !client?.transport?.url) return [];
    try {
      const srm = new SocialRecoveryModule();
      const guardians = (await srm.getGuardians(
        client.transport.url,
        account.address
      )) as Address[];

      return guardians;
    } catch (e) {
      setErrors((errors) => [
        ...errors,
        new Error(`Error listing guardians: ${(e as Error).message}`),
      ]);
      return undefined;
    }
  }, [account?.address, client?.transport?.url]);

  const listOwners = useCallback(async () => {
    if (!account?.address || !client?.transport?.url) return undefined;

    try {
      const safeAccount = new SafeAccountV0_3_0(account.address);
      const owners = (await safeAccount.getOwners(
        client.transport.url
      )) as Address[];
      return owners;
    } catch (e) {
      setErrors((errors) => [
        ...errors,
        new Error(`Error listing guardians: ${(e as Error).message}`),
      ]);
      return undefined;
    }
  }, [account?.address, client?.transport?.url]);

  useEffect(() => {
    listOwners().then((newOwners) => setOwners(newOwners));
  }, [listOwners]);

  useEffect(() => {
    listGuardians().then((newGuardians) => setGuardians(newGuardians));
  }, [listGuardians]);

  return { guardians, owners, errors };
}
