"use client";

import { Guardian, GuardianList } from "@/components/guardian-list";
import GuardiansContent from "@/components/guardians-content";
import RecoveryContent from "@/components/recovery-content";
import RecoverySidebar from "@/components/recovery-sidebar";
import { Button } from "@/components/ui/button";
import {
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from "@/components/ui/tabs";
import { STYLES } from "@/constants/styles";
import { cn } from "@/lib/utils";
import React, { useState } from "react";

const tabState = cn(
  "data-[state=active]:bg-secondary",
  "data-[state=active]:text-secondary-foreground",
  "data-[state=active]:opacity-100"
);

const initialGuardians: Guardian[] = [
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

export default function Dashboard() {
  const recoveryLink = "https://candide.com/recovery/0xabc.eth";
  const hasActiveRecovery = true;

  const [currentGuardians, setCurrentGuardians] = useState(initialGuardians);

  const handleChangeGuardians = (guardians: Guardian[]) => {
    setCurrentGuardians(guardians);
  };

  return (
    <div className="flex flex-col flex-1 mx-8">
      <div className="max-w-6xl mx-auto">
        <TabsRoot defaultValue="management" className="flex flex-col w-full">
          <TabsList className="bg-content-background p-1 shadow-md rounded-xl mt-12 mb-3 self-end">
            <TabsTrigger
              value="management"
              className={cn(STYLES.baseTab, tabState)}
            >
              Recovery Management
            </TabsTrigger>
            <TabsTrigger
              value="guardians"
              className={cn(STYLES.baseTab, tabState)}
            >
              Account Guardians
            </TabsTrigger>
          </TabsList>

          <TabsContent value="management">
            <div className="grid grid-cols-3 gap-6">
              <RecoverySidebar
                hasActiveRecovery={hasActiveRecovery}
                recoveryLink={recoveryLink}
                safeAccount={safeAccount}
              />
              <RecoveryContent
                hasActiveRecovery={hasActiveRecovery}
                guardians={currentGuardians}
                safeSigners={safeSigners}
                safeAccount={safeAccount}
              />
            </div>
          </TabsContent>

          <TabsContent value="guardians">
            <div className="grid grid-cols-3 gap-6">
              <RecoverySidebar
                hasActiveRecovery={hasActiveRecovery}
                recoveryLink={recoveryLink}
                safeAccount={safeAccount}
              />
              <GuardiansContent
                currentGuardians={currentGuardians}
                onChangeCurrentGuardians={handleChangeGuardians}
              />
            </div>
          </TabsContent>
        </TabsRoot>
      </div>
    </div>
  );
}
