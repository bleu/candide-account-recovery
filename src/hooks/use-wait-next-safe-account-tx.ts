import { Address } from "viem";
import { usePublicClient } from "wagmi";
import { useIsSafeAccount } from "./use-is-safe-account";
import { useCallback, useMemo } from "react";
import { safeWalletAbi } from "@/utils/abis/safeWalletAbi";

export function useWaitNextSafeAccountTx({
  safeAddress,
}: {
  safeAddress: Address | undefined;
}) {
  const publicClient = usePublicClient();
  const { isSafeAccount } = useIsSafeAccount();

  const abortController = useMemo(() => new AbortController(), []);

  const waitNextSafeAccountTx = useCallback(async () => {
    if (!publicClient) throw new Error("Missing public client");
    if (!safeAddress) throw new Error("Missing safe address");
    if (!isSafeAccount) throw new Error("Not a safe address");

    const filter = await publicClient.createContractEventFilter({
      address: safeAddress,
      abi: safeWalletAbi,
      eventName: "ExecutionSuccess",
    });

    const retryTimesMs = [
      10000, 10000, 10000, 10000, 10000, 30000, 30000, 30000, 30000, 60000,
      60000, 60000,
    ];

    while (true) {
      if (abortController.signal.aborted) {
        return false;
      }

      const logs = await publicClient.getFilterChanges({ filter });

      if (logs.length > 0) {
        publicClient.uninstallFilter({ filter });
        return true;
      }

      if (retryTimesMs.length === 0) {
        publicClient.uninstallFilter({ filter });
        return false;
      }

      const retryTime = retryTimesMs.shift();

      try {
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(resolve, retryTime);
          abortController.signal.addEventListener("abort", () => {
            clearTimeout(timeout);
            reject(new Error("Aborted"));
          });
        });
      } catch (error: unknown) {
        if (error instanceof Error && error.message === "Aborted") return false;
        throw error;
      }
    }
  }, [publicClient, safeAddress, isSafeAccount, abortController]);

  const cancel = () => {
    abortController.abort();
  };

  return { waitNextSafeAccountTx, cancel };
}
