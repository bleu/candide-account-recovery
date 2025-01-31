"use client";

import { createFinalUrl, RecoveryQueryParams } from "@/app/ask-recovery/page";
import { NewAddress } from "@/components/guardian-list";
import GuardiansContent from "@/components/guardians-content";
import RecoveryContent from "@/components/recovery-content";
import RecoverySidebar from "@/components/recovery-sidebar";
import {
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from "@/components/ui/tabs";
import { STYLES } from "@/constants/styles";
import { useRecoveryInfo } from "@/hooks/useRecoveryInfo";
import { cn } from "@/lib/utils";
import React, { Usable, useEffect, useState } from "react";
import { isAddress } from "viem";
import { useAccount } from "wagmi";

type LinkParams = {
  safeAddress?: string;
  newOwners?: string;
  newThreshold?: string;
};

const tabState = cn(
  "data-[state=active]:bg-secondary",
  "data-[state=active]:text-secondary-foreground",
  "data-[state=active]:opacity-100"
);

const initialGuardians: NewAddress[] = [
  {
    nickname: "Friend1",
    address: "0x123456789abcdef123456789abcdef12345678",
    status: "Pending",
  },
  {
    nickname: "Friend2",
    address: "0x123456789abcdef123456789abcdef12345678",
    status: "Pending",
  },
];

const safeSigners = [
  "0x1234567890abcdef1234567890abcdef12345678",
  "0x1334567890abcdef1234567890abcdef12345678",
];

const safeAccount = "0xabc.eth";

const recoverLinkParams = (linkParams: LinkParams) => {
  const { safeAddress } = linkParams;
  const newOwners =
    linkParams?.newOwners !== undefined
      ? linkParams.newOwners.split(",")
      : undefined;
  const newThreshold =
    linkParams?.newThreshold !== undefined
      ? Number(linkParams.newThreshold)
      : undefined;
  const recoveryLink =
    safeAddress &&
    newOwners &&
    newThreshold &&
    validateLinkParams({ safeAddress, newOwners, newThreshold }).isValid
      ? createFinalUrl({ safeAddress, newOwners, newThreshold })
      : undefined;

  return { safeAddress, recoveryLink, newOwners, newThreshold };
};

// TODO: improve this to use a logic similar as form
const validateLinkParams = ({
  safeAddress,
  newOwners,
  newThreshold,
}: RecoveryQueryParams): { isValid: boolean; reason: string } => {
  if (!isAddress(safeAddress))
    return { isValid: false, reason: "Safe address is not an address." };

  for (const owner of newOwners) {
    if (!isAddress(owner))
      return { isValid: false, reason: "One of the owners is not an address." };
  }

  if (newThreshold < 1 || newThreshold > newOwners.length)
    return {
      isValid: false,
      reason: "Threshold must be between 1 and number of owners.",
    };

  return { isValid: true, reason: "" };
};

export default function Dashboard({
  searchParams,
}: {
  searchParams: Usable<LinkParams>;
}) {
  const params = React.use(searchParams);
  const {
    safeAddress,
    newOwners,
    newThreshold,
    recoveryLink: recoveryLinkFromParams,
  } = recoverLinkParams(params);

  const { data: recoveryInfo } = useRecoveryInfo();
  const { address } = useAccount();

  const hasActiveRecovery = true;

  const [currentGuardians, setCurrentGuardians] = useState(initialGuardians);
  const [threshold, setThreshold] = useState(1);
  const [delayPeriod, setDelayPeriod] = useState(3);
  const [recoveryLink, setRecoveryLink] = useState<string | undefined>(
    undefined
  );
  const [recoveryLinkFromWallet, setRecoveryLinkFromWallet] = useState<
    string | undefined
  >(undefined);
  const [isLinkRequired, setIsLinkRequired] = useState(true);

  const handleChangeGuardians = (guardians: NewAddress[]) => {
    setCurrentGuardians(guardians);
  };

  useEffect(() => {
    //Build a link with recoveryInfo if there is one
    if (address && recoveryInfo) {
      const newRecoveryLinkFromWallet = createFinalUrl({
        safeAddress: address,
        newOwners: recoveryInfo.newOwners,
        newThreshold: Number(recoveryInfo.newThreshold),
      });
      setRecoveryLinkFromWallet(newRecoveryLinkFromWallet);
    }
  }, [recoveryInfo, address]);

  useEffect(() => {
    if (recoveryLinkFromWallet || recoveryLinkFromParams) {
      setIsLinkRequired(false);
      setRecoveryLink(recoveryLinkFromWallet ?? recoveryLinkFromParams);
    }
  }, [recoveryLinkFromParams, recoveryLinkFromWallet]);

  return (
    <div className="flex flex-col flex-1 mx-8">
      <div className="max-w-6xl mx-auto">
        <TabsRoot defaultValue="management" className="flex flex-col w-full">
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
                hasActiveRecovery={hasActiveRecovery}
                recoveryLink={recoveryLink ?? ""}
                safeAccount={safeAccount}
              />
              <RecoveryContent
                hasActiveRecovery={hasActiveRecovery}
                guardians={currentGuardians}
                safeSigners={safeSigners}
                safeAccount={safeAccount}
                threshold={threshold}
                delayPeriod={delayPeriod}
                isLinkRequired={isLinkRequired}
              />
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid grid-cols-3 gap-6">
              <RecoverySidebar
                hasActiveRecovery={hasActiveRecovery}
                recoveryLink={recoveryLink ?? ""}
                safeAccount={safeAccount}
              />
              <GuardiansContent
                threshold={threshold}
                delayPeriod={delayPeriod}
                currentGuardians={currentGuardians}
                onThresholdChange={setThreshold}
                onDelayPeriodChange={setDelayPeriod}
                onChangeCurrentGuardians={handleChangeGuardians}
              />
            </div>
          </TabsContent>
        </TabsRoot>
      </div>
    </div>
  );
}
