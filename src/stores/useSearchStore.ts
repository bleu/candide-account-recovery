import { useToast } from "@/hooks/use-toast";
import { useLoadingContext } from "@/providers/loading";
import { createFinalUrl, isValidLink } from "@/utils/recovery-link";
import { useState } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { Address, isAddress } from "viem";
import { useSocialRecoveryModule } from "@/hooks/use-social-recovery-module";
import { socialRecoveryModuleAbi } from "@/utils/abis/socialRecoveryModuleAbi";

export const useSearchStore = () => {
  const [searchValue, setSearchValue] = useState("");
  const { isLoading, setIsLoading } = useLoadingContext();
  const { toast } = useToast();

  const publicClient = usePublicClient();
  const { chainId } = useAccount();
  const { srm } = useSocialRecoveryModule({
    safeAddress: isAddress(searchValue) ? searchValue : undefined,
  });

  const getOngoingRecoveryLink = async (address: Address) => {
    if (!publicClient) throw new Error("Missing public client");
    if (!chainId) throw new Error("Missing chainId");
    if (!srm) throw new Error("Missing srm");

    const data = await publicClient.readContract({
      address: srm.moduleAddress as Address,
      abi: socialRecoveryModuleAbi,
      functionName: "getRecoveryRequest",
      args: [address],
    });

    if (data.newThreshold)
      return createFinalUrl({
        safeAddress: searchValue,
        newOwners: data.newOwners as Address[],
        newThreshold: Number(data.newThreshold),
        chainId: String(chainId),
      });
    return "";
  };

  const handleSearch = async () => {
    if (!searchValue.trim()) return;

    setIsLoading(true);

    try {
      console.log("searching", searchValue);

      if (isValidLink(searchValue)) {
        window.location.href = searchValue;
        return;
      }

      if (isAddress(searchValue)) {
        const link = await getOngoingRecoveryLink(searchValue);
        if (link) {
          window.location.href = link;
          return;
        }
        toast({
          title: "No recovery process found for this address",
          description: "Please, check the address and connected chain",
          isWarning: true,
        });
        return;
      }

      toast({
        title: "Couldn't find any results",
        description: "Please, insert a valid address or link",
        isWarning: true,
      });
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Couldn't find any results",
        description: "Please, insert a valid address or link",
        isWarning: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSearch, searchValue, setSearchValue, isLoading };
};
