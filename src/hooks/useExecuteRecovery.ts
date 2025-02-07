import { getReadableError } from "@/utils/get-readable-error";
import { useMutation } from "@tanstack/react-query";
import { SocialRecoveryModule } from "abstractionkit";
import { useState } from "react";
import { Address } from "viem";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";

interface ExecuteRecoveryParams {
  safeAddress: Address | undefined;
  newOwners: Address[] | undefined;
  newThreshold: number | undefined;
}

export function useExecuteRecovery({
  safeAddress,
  newOwners,
  newThreshold,
}: ExecuteRecoveryParams) {
  const { address: signer } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!signer || !walletClient || !publicClient) {
        throw new Error("Missing signer or client");
      }

      if (!safeAddress || !newOwners || !newThreshold) {
        throw new Error("Missing executeRecovery params");
      }

      const srm = new SocialRecoveryModule();

      const tx = srm.createExecuteRecoveryMetaTransaction(
        safeAddress,
        newOwners,
        newThreshold
      );

      const newTx = {
        to: tx.to as Address,
        data: tx.data as `0x${string}`,
        value: tx.value,
      };

      const newTxHash = await walletClient.sendTransaction(newTx);

      setTxHash(newTxHash);
    },
  });

  const executeRecovery = () => {
    if (
      signer &&
      walletClient &&
      publicClient &&
      safeAddress &&
      newOwners &&
      newThreshold
    ) {
      mutation.mutate();
    }
  };

  const reset = () => {
    setTxHash(undefined);
    mutation.reset();
  };

  return {
    txHash,
    executeRecovery,
    error: mutation?.error && getReadableError(mutation.error),
    isLoading: mutation.isPending,
    reset,
  };
}
