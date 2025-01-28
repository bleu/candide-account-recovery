import { useMutation } from "@tanstack/react-query";
import { SocialRecoveryModule } from "abstractionkit";
import { useState } from "react";
import { Address } from "viem";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";

interface ExecuteRecoveryParams {
  safeAddress: Address;
  newOwners: Address[];
  newThreshold: number;
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

      console.log({ newTx });

      const newTxHash = await walletClient.sendTransaction(newTx);

      setTxHash(newTxHash);
    },
  });

  const executeRecovery = () => {
    if (signer && walletClient && publicClient) {
      mutation.mutate();
    }
  };

  return {
    txHash,
    executeRecovery,
    error: mutation?.error && mutation.error,
    isLoading: mutation.isPending,
  };
}
