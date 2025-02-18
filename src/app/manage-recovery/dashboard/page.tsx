"use client";

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
import { useApprovalsInfo } from "@/hooks/useApprovalsInfo";
import useHashParams from "@/hooks/useHashParams";
import { useOngoingRecoveryInfo } from "@/hooks/useOngoingRecoveryInfo";
import { useOwners } from "@/hooks/useOwners";
import { cn } from "@/lib/utils";
import { createFinalUrl } from "@/utils/recovery-link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Address } from "viem";
import { useAccount } from "wagmi";

const tabState = cn(
  "data-[state=active]:bg-secondary",
  "data-[state=active]:text-secondary-foreground",
  "data-[state=active]:opacity-100"
);

export default function Dashboard() {
  const router = useRouter();
  const params = useHashParams();
  const {
    safeAddress: safeAddressFromParams,
    newOwners: newOwnersFromParams,
    newThreshold: newThresholdFromParams,
    recoveryLink: recoveryLinkFromParams,
  } = params;
  const { data: recoveryInfo } = useOngoingRecoveryInfo(safeAddressFromParams);
  const { address, isConnecting } = useAccount();

  const [threshold, setThreshold] = useState(1);
  const [delayPeriod, setDelayPeriod] = useState(3);

  const recoveryLinkFromWallet =
    address && recoveryInfo && recoveryInfo.newThreshold.toString() !== "0"
      ? createFinalUrl({
          safeAddress: address,
          newOwners: recoveryInfo.newOwners as Address[],
          newThreshold: Number(recoveryInfo.newThreshold),
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

  const { data: safeSigners } = useOwners(safeAddress);

  const { data: approvalsInfo } = useApprovalsInfo({
    safeAddress,
    newOwners,
    newThreshold,
  });

  const shouldRedirectToSettings =
    recoveryInfo && isLinkRequired && !recoveryInfo?.executeAfter;

  useEffect(() => {
    if (!address && !isConnecting && shouldRedirectToSettings === undefined)
      router.push("/manage-recovery");
  }, [address, shouldRedirectToSettings, isConnecting, router]);

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
                  />
                  <RecoveryContent
                    safeSigners={safeSigners}
                    safeAddress={safeAddress}
                    newOwners={newOwners}
                    newThreshold={newThreshold}
                    delayPeriod={delayPeriod}
                    isLinkRequired={isLinkRequired}
                    approvalsInfo={approvalsInfo}
                    recoveryInfo={recoveryInfo}
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
                  />
                  <GuardiansContent
                    threshold={threshold}
                    delayPeriod={delayPeriod}
                    onThresholdChange={setThreshold}
                    onDelayPeriodChange={setDelayPeriod}
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
