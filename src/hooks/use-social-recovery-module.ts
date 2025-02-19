import {
  SocialRecoveryModule,
  SocialRecoveryModuleGracePeriodSelector,
} from "abstractionkit";
import { useMemo } from "react";
import { Address } from "viem";
import { useAccount, usePublicClient } from "wagmi";
import { sepolia } from "wagmi/chains";
import { useQuery } from "@tanstack/react-query";
import { socialRecoveryModuleAbi } from "@/utils/abis/socialRecoveryModuleAbi";

type SrmAddress =
  | SocialRecoveryModuleGracePeriodSelector.After3Minutes
  | SocialRecoveryModuleGracePeriodSelector.After3Days
  | SocialRecoveryModuleGracePeriodSelector.After7Days
  | SocialRecoveryModuleGracePeriodSelector.After14Days;

const srmAddresses: SrmAddress[] = [
  SocialRecoveryModuleGracePeriodSelector.After3Minutes,
  SocialRecoveryModuleGracePeriodSelector.After3Days,
  SocialRecoveryModuleGracePeriodSelector.After7Days,
  SocialRecoveryModuleGracePeriodSelector.After14Days,
];

interface UseSocialRecoveryModuleParams {
  srmAddress?: SrmAddress;
  safeAddress?: Address;
}

const delayPeriodMap: Record<SrmAddress, string> = {
  [SocialRecoveryModuleGracePeriodSelector.After3Minutes]: "3-minute",
  [SocialRecoveryModuleGracePeriodSelector.After3Days]: "3-day",
  [SocialRecoveryModuleGracePeriodSelector.After7Days]: "7-day",
  [SocialRecoveryModuleGracePeriodSelector.After14Days]: "14-day",
};

export function useSocialRecoveryModule(
  params?: UseSocialRecoveryModuleParams
): {
  srm: SocialRecoveryModule | undefined;
  delayPeriod: string | undefined;
  modulesWithGuardians: SrmAddress[] | undefined;
} {
  const { srmAddress, safeAddress } = params ?? {};
  const { address, chainId } = useAccount();
  const publicClient = usePublicClient();

  const addressToFetch = safeAddress ?? address;

  const { data: modulesWithGuardians } = useQuery({
    queryKey: ["allGuardians", chainId, addressToFetch],
    queryFn: async () => {
      if (!publicClient) throw new Error("missing public client");
      if (!addressToFetch) throw new Error("missing address to fetch");
      if (!chainId) throw new Error("missing chainId");

      const guardianCounts = await publicClient.multicall({
        contracts: srmAddresses.map((addr) => ({
          address: addr,
          abi: socialRecoveryModuleAbi,
          functionName: "guardiansCount",
          args: [addressToFetch],
        })),
      });

      const output = srmAddresses.filter(
        (address, index) =>
          guardianCounts[index].status === "success" &&
          Number(guardianCounts[index].result) > 0
      );
      return output;
    },
  });

  const srm = useMemo(() => {
    if (srmAddress) return new SocialRecoveryModule(srmAddress);
    if (chainId && chainId === sepolia.id)
      return new SocialRecoveryModule(
        SocialRecoveryModuleGracePeriodSelector.After3Minutes
      );
    if (modulesWithGuardians && modulesWithGuardians.length > 0)
      return new SocialRecoveryModule(modulesWithGuardians[0]);
    return undefined;
  }, [srmAddress, chainId, modulesWithGuardians]);

  const delayPeriod = useMemo(
    () => srm && delayPeriodMap[srm.moduleAddress as SrmAddress],
    [srm]
  );

  return { srm, delayPeriod, modulesWithGuardians };
}
