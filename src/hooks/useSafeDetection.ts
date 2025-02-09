import { Address, PublicClient } from "viem";
import { useAccount, useWalletClient, usePublicClient } from "wagmi";
import { useState, useEffect } from "react";

interface SafeDetectionResult {
  /**
   * Whether the current wallet is a Safe wallet.
   * Returns false while checking or if checks haven't completed.
   */
  isSafeWallet: boolean;
}

async function isSafeAccount(
  address: string,
  publicClient?: PublicClient
): Promise<boolean> {
  if (!publicClient) {
    return false;
  }

  try {
    const code = await publicClient.getCode({
      address: address as Address,
    });
    // Check if the address has contract code and matches Safe signature
    return Boolean(code && code.length > 2);
  } catch {
    return false;
  }
}

/**
 * Hook for detecting if the current wallet is a Safe wallet
 * @returns Object containing Safe detection state
 */
export function useSafeDetection(): SafeDetectionResult {
  const { address: signer } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const [isSafe, setIsSafe] = useState<boolean>(false);
  const [isCheckingCode, setIsCheckingCode] = useState(true);
  const [hasInitialCheck, setHasInitialCheck] = useState(false);

  useEffect(() => {
    // Reset states when signer changes
    if (!signer) {
      setIsSafe(false);
      setIsCheckingCode(false);
      setHasInitialCheck(false);
      return;
    }

    setIsCheckingCode(true);
    console.log("Checking if Safe account:", { signer });
    isSafeAccount(signer, publicClient)
      .then((result) => {
        console.log("isSafeAccount result:", { result });
        setIsSafe(result);
      })
      .catch((error) => {
        console.error("Error checking Safe account:", error);
        setIsSafe(false);
      })
      .finally(() => {
        setIsCheckingCode(false);
        setHasInitialCheck(true);
      });
  }, [signer, publicClient]);

  // Verify we're in a Safe context
  const hasSafeContracts = Boolean(walletClient?.chain?.contracts?.safe);
  const isSafeType = Boolean(
    walletClient?.account?.type?.toLowerCase() === "safe"
  );

  // Only return true if:
  // 1. We've completed the initial check
  // 2. We're not currently checking
  // 3. One of our Safe checks passed
  const isSafeWallet =
    hasInitialCheck &&
    !isCheckingCode &&
    Boolean(hasSafeContracts || isSafeType || isSafe);

  return { isSafeWallet };
}
