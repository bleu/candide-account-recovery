import { useMutation } from "@tanstack/react-query";
import { SocialRecoveryModule } from "abstractionkit";
import { useState } from "react";
import { Address } from "viem";
import { useAccount, useWalletClient } from "wagmi";

export function useCancelRecovery() {
  const { address: signer } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!signer || !walletClient) {
        throw new Error("Missing signer or client");
      }

      const srm = new SocialRecoveryModule();

      const tx = srm.createCancelRecoveryMetaTransaction();

      const newTx = {
        to: tx.to as Address,
        data: tx.data as `0x${string}`,
        value: tx.value,
      };

      const newTxHash = await walletClient.sendTransaction(newTx);

      setTxHash(newTxHash);
    },
  });

  const cancelRecovery = () => {
    if (signer && walletClient) {
      mutation.mutate();
    }
  };

  return {
    txHash,
    cancelRecovery,
    error: mutation?.error && mutation.error,
    isLoading: mutation.isPending,
  };
}
