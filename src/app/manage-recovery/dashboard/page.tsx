"use client";

import { ConnectWalletButton } from "@/components/connect-wallet-button";
import GuardiansContent from "@/components/guardians-content";
import LoadingGeneric from "@/components/loading-generic";
import RecoveryContent from "@/components/recovery-content";
import RecoverySidebar from "@/components/recovery-sidebar";
import {
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from "@/components/ui/tabs";
import { STYLES } from "@/constants/styles";
import { useSocialRecoveryModule } from "@/hooks/use-social-recovery-module";
import { useApprovalsInfo } from "@/hooks/useApprovalsInfo";
import useHashParams from "@/hooks/useHashParams";
import { useOngoingRecoveryInfo } from "@/hooks/useOngoingRecoveryInfo";
import { useOwners } from "@/hooks/useOwners";
import { cn } from "@/lib/utils";
import { createFinalUrl } from "@/utils/recovery-link";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Address } from "viem";
import { useAccount, useSwitchChain } from "wagmi";
import { sepolia } from "wagmi/chains";

const tabState = cn(
  "data-[state=active]:bg-secondary",
  "data-[state=active]:text-secondary-foreground",
  "data-[state=active]:opacity-100"
);

export default function Dashboard() {
  const params = useHashParams();
  const {
    safeAddress: safeAddressFromParams,
    newOwners: newOwnersFromParams,
    newThreshold: newThresholdFromParams,
    chainId: chainIdFromParams,
    recoveryLink: recoveryLinkFromParams,
  } = params;
  const { data: recoveryInfo } = useOngoingRecoveryInfo(
    safeAddressFromParams,
    chainIdFromParams
  );
  const { chainId: chainIdFromWallet, address, isConnecting } = useAccount();

  const [threshold, setThreshold] = useState(1);
  const [delayPeriod, setDelayPeriod] = useState(3);
  useEffect(() => {
    if (chainIdFromWallet === sepolia.id) setDelayPeriod(1);
  }, [chainIdFromWallet]);
  const { switchChain } = useSwitchChain();

  const recoveryLinkFromWallet =
    address &&
    recoveryInfo &&
    recoveryInfo.newThreshold.toString() !== "0" &&
    chainIdFromWallet
      ? createFinalUrl({
          safeAddress: address,
          newOwners: recoveryInfo.newOwners as Address[],
          newThreshold: Number(recoveryInfo.newThreshold),
          chainId: chainIdFromWallet.toString(),
        })
      : undefined;

  const recoveryLink = recoveryLinkFromWallet ?? recoveryLinkFromParams;
  const isLinkRequired = !Boolean(recoveryLink);

  const safeAddressFromWallet = recoveryLinkFromWallet ? address : undefined;
  const newOwnersFromWallet =
    recoveryInfo && recoveryLinkFromWallet
      ? (recoveryInfo.newOwners as Address[])
      : undefined;
  const newThresholdFromWallet =
    recoveryInfo && recoveryLinkFromWallet
      ? Number(recoveryInfo.newThreshold)
      : undefined;

  const safeAddress = safeAddressFromParams ?? safeAddressFromWallet ?? address;
  const newOwners = newOwnersFromParams ?? newOwnersFromWallet;
  const newThreshold = newThresholdFromParams ?? newThresholdFromWallet;
  const chainId = chainIdFromParams ?? chainIdFromWallet;

  const { data: safeSigners } = useOwners(safeAddress, chainId);

  const { delayPeriod: delayPeriodStr } = useSocialRecoveryModule({
    safeAddress,
    chainId,
  });

  const { data: approvalsInfo } = useApprovalsInfo({
    safeAddress,
    newOwners,
    newThreshold,
    chainId,
  });

  const shouldRedirectToSettings = !recoveryLink && address;
  const shouldCallReconnect = !recoveryLink && !address && !isConnecting;

  // Atomatically switches to link chain
  useEffect(() => {
    if (
      recoveryLinkFromParams &&
      chainIdFromParams &&
      chainIdFromWallet &&
      chainIdFromWallet !== chainIdFromParams
    )
      switchChain({ chainId: chainIdFromParams });
  }, [
    switchChain,
    recoveryLinkFromParams,
    chainIdFromParams,
    chainIdFromWallet,
  ]);

  const queryClient = useQueryClient();

  const resetQueries = () => {
    queryClient.invalidateQueries({
      queryKey: ["approvalsInfo", safeAddress, newOwners, newThreshold],
    });
    queryClient.invalidateQueries({
      queryKey: ["recoveryInfo", chainId, safeAddress],
    });
    queryClient.invalidateQueries({
      queryKey: ["guardians", chainId, safeAddress],
    });
    queryClient.invalidateQueries({
      queryKey: ["threshold", safeAddress],
    });
  };

  if (shouldCallReconnect)
    return (
      <div className="flex flex-1 items-center justify-center mx-8">
        <div className="max-w-2xl text-center">
          <h2 className="text-2xl text-primary font-bold font-roboto-mono text-center ">
            Connect to an Account
          </h2>
          <p className="text-lg font-roboto-mono text-center text-foreground mb-6 mt-4">
            You can only manage your recovery guardians, threshold and delay
            period after connecting to an account.
          </p>
          <ConnectWalletButton />
        </div>
      </div>
    );

  return (
    <>
      {shouldRedirectToSettings !== undefined ? (
        <div className="flex flex-col flex-1 mx-8">
          <div className="max-w-6xl mx-auto">
            <TabsRoot
              defaultValue={
                shouldRedirectToSettings ? "settings" : "management"
              }
              className="flex flex-col w-full"
            >
              <TabsList className="bg-content-background p-1 shadow-md rounded-xl mt-12 mb-3 self-end">
                <TabsTrigger
                  value="management"
                  className={cn(STYLES.baseTab, tabState)}
                >
                  Recovery Process
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className={cn(STYLES.baseTab, tabState)}
                >
                  Recovery Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="management">
                <div className="grid grid-cols-3 gap-6">
                  <RecoverySidebar
                    recoveryLink={recoveryLink ?? ""}
                    safeAddress={safeAddress}
                    approvalsInfo={approvalsInfo}
                    recoveryInfo={recoveryInfo}
                    resetQueries={resetQueries}
                  />
                  <RecoveryContent
                    safeSigners={safeSigners}
                    safeAddress={safeAddress}
                    newOwners={newOwners}
                    newThreshold={newThreshold}
                    delayPeriod={delayPeriodStr ?? ""}
                    isLinkRequired={isLinkRequired}
                    approvalsInfo={approvalsInfo}
                    recoveryInfo={recoveryInfo}
                    resetQueries={resetQueries}
                  />
                </div>
              </TabsContent>

              <TabsContent value="settings">
                <div className="grid grid-cols-3 gap-6">
                  <RecoverySidebar
                    recoveryLink={recoveryLink ?? ""}
                    safeAddress={safeAddress}
                    approvalsInfo={approvalsInfo}
                    recoveryInfo={recoveryInfo}
                    resetQueries={resetQueries}
                  />
                  <GuardiansContent
                    threshold={threshold}
                    delayPeriod={delayPeriod}
                    onThresholdChange={setThreshold}
                    onDelayPeriodChange={setDelayPeriod}
                    resetQueries={resetQueries}
                  />
                </div>
              </TabsContent>
            </TabsRoot>
          </div>
        </div>
      ) : (
        <LoadingGeneric />
      )}
    </>
  );
}
