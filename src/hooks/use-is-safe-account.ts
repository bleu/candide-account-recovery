import { Address } from "viem";
import { useAccount, useWalletClient, usePublicClient } from "wagmi";
import { useQuery } from "@tanstack/react-query";

interface SafeDetectionResult {
  /**
   * Whether the current wallet is a Safe wallet.
   * Returns false while checking or if checks haven't completed.
   */
  isSafeAccount: boolean;
}

/**
 * Hook for detecting if the current wallet is a Safe wallet
 * @returns Object containing Safe detection state
 */
export function useIsSafeAccount(): SafeDetectionResult {
  const { address: signer, chainId } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const { data: hasContractCode } = useQuery({
    queryKey: ["hasContractCode", chainId, signer],
    queryFn: async () => {
      if (!publicClient) throw new Error("missing public client");
      if (!signer) throw new Error("missing signer");

      try {
        const code = await publicClient.getCode({
          address: signer as Address,
        });
        // Check if the address has contract code and matches Safe signature
        return Boolean(code && code.length > 2);
      } catch {
        return false;
      }
    },
    enabled: Boolean(publicClient) && Boolean(signer),
  });

  const hasSafeContracts = Boolean(walletClient?.chain?.contracts?.safe);
  const isSafeType = Boolean(
    walletClient?.account?.type?.toLowerCase() === "safe"
  );

  // Only return true if one of our Safe checks passed
  const isSafeAccount = Boolean(
    hasSafeContracts || isSafeType || hasContractCode
  );
  return { isSafeAccount };
}
