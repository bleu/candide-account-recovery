import { SocialRecoveryModule } from "abstractionkit";
import { useCallback } from "react";
import { Address } from "viem";
import { useAccount, useWalletClient } from "wagmi";
import { useExecuteTransaction } from "./useExecuteTransaction";

export function useCancelRecovery({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: () => void;
}) {
  const { address: signer } = useAccount();
  const { data: walletClient } = useWalletClient();

  const buildTxFn = useCallback(async () => {
    if (!signer || !walletClient) {
      throw new Error("Missing signer or client");
    }

    const srm = new SocialRecoveryModule();
    const tx = srm.createCancelRecoveryMetaTransaction();

    return [
      {
        to: tx.to as Address,
        data: tx.data as `0x${string}`,
        value: tx.value,
      },
    ];
  }, [signer, walletClient]);

  return useExecuteTransaction({
    buildTxFn,
    onSuccess,
    onError,
  });
}
