import { useMutation } from "@tanstack/react-query";
import { SocialRecoveryModule } from "abstractionkit";
import { useState } from "react";
import { Address } from "viem";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";

export function useFinalizeRecovery(safeAddress: Address | undefined) {
  const { address: signer } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!signer || !walletClient || !publicClient) {
        throw new Error("Missing signer or client");
      }

      if (!safeAddress) {
        throw new Error("Missing safe address");
      }

      const srm = new SocialRecoveryModule();

      const tx = srm.createFinalizeRecoveryMetaTransaction(safeAddress);

      const newTx = {
        to: tx.to as Address,
        data: tx.data as `0x${string}`,
        value: tx.value,
      };

      const newTxHash = await walletClient.sendTransaction(newTx);

      setTxHash(newTxHash);
    },
  });

  const finalizeRecovery = () => {
    if (signer && walletClient && publicClient && safeAddress) {
      mutation.mutate();
    }
  };

  return {
    txHash,
    finalizeRecovery,
    error: mutation?.error && mutation.error,
    isLoading: mutation.isPending,
  };
}
