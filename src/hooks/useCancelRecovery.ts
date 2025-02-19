import { useSocialRecoveryModule } from "./use-social-recovery-module";
import { useCallback } from "react";
import { Address } from "viem";
import { useAccount, useWalletClient } from "wagmi";
import { useExecuteTransaction } from "./useExecuteTransaction";

export function useCancelRecovery({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const { address: signer } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { srm } = useSocialRecoveryModule();

  const buildTxFn = useCallback(async () => {
    if (!signer || !walletClient || !srm) {
      throw new Error("Missing srm, signer or client");
    }

    const tx = srm.createCancelRecoveryMetaTransaction();

    return [
      {
        to: tx.to as Address,
        data: tx.data as `0x${string}`,
        value: tx.value,
      },
    ];
  }, [signer, walletClient, srm]);

  return useExecuteTransaction({
    buildTxFn,
    onSuccess,
    onError,
  });
}
