import { Address } from "viem";
import { usePublicClient, useWalletClient } from "wagmi";
import { useIsSafeAccount } from "./use-is-safe-account";
import { useCallback, useMemo } from "react";
import { eip5792Actions } from "viem/experimental";

export function useWaitNextSafeAccountTx({
  safeAddress,
}: {
  safeAddress: Address | undefined;
}) {
  const publicClient = usePublicClient();
  const { data: rawWalletClient } = useWalletClient();
  const walletClient = rawWalletClient?.extend(eip5792Actions());
  const { isSafeAccount } = useIsSafeAccount();

  const abortController = useMemo(() => new AbortController(), []);

  const waitNextSafeAccountTx = useCallback(
    async (txHash: `0x${string}`) => {
      if (!publicClient) throw new Error("Missing public client");
      if (!walletClient) throw new Error("Missing wallet client");
      if (!safeAddress) throw new Error("Missing safe address");
      if (!isSafeAccount) throw new Error("Not a safe address");

      const retryTimesMs = [
        10000, 10000, 10000, 10000, 10000, 30000, 30000, 30000, 30000, 60000,
        60000, 60000,
      ];

      while (true) {
        if (abortController.signal.aborted) {
          throw new Error("Aborted");
        }

        if (retryTimesMs.length === 0) throw new Error("Transaction time out.");

        const retryTime = retryTimesMs.shift();

        await new Promise((resolve, reject) => {
          const timeout = setTimeout(resolve, retryTime);
          abortController.signal.addEventListener("abort", () => {
            clearTimeout(timeout);
            reject(new Error("Aborted"));
            throw new Error("Aborted");
          });
        });

        try {
          const { receipts } = await walletClient.getCallsStatus({
            id: txHash,
          });
          if (receipts && receipts.length > 0) return true;
        } catch (e) {
          if ((e as Error)?.message.includes("Transaction not found"))
            return true;
          console.error(e);
          throw e;
        }
      }
    },
    [publicClient, walletClient, safeAddress, isSafeAccount, abortController]
  );

  const cancel = () => {
    abortController.abort();
  };

  return { waitNextSafeAccountTx, cancel };
}
