"use client";

import RecoveryContent from "@/components/recovery-content";
import RecoverySidebar from "@/components/recovery-sidebar";
import { TabsList, TabsRoot, TabsTrigger } from "@/components/ui/tabs";
import { STYLES } from "@/constants/styles";
import { cn } from "@/lib/utils";
import React from "react";

const tabState = cn(
  "data-[state=active]:bg-secondary",
  "data-[state=active]:text-secondary-foreground",
  "data-[state=active]:opacity-100"
);

export default function Dashboard() {
  const guardians = [
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
  const recoveryLink = "https://candide.com/recovery/0xabc.eth";
  const hasActiveRecovery = true;

  return (
    <div className="flex flex-col flex-1 mx-8">
      <div className="max-w-6xl mx-auto">
        <TabsRoot defaultValue="management" className="flex justify-end ">
          <TabsList className="bg-content-background p-1 shadow-md rounded-xl mt-12 mb-3">
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
        </TabsRoot>

        <div className="grid grid-cols-3 gap-6">
          <RecoverySidebar
            hasActiveRecovery={hasActiveRecovery}
            recoveryLink={recoveryLink}
          />
          <RecoveryContent
            hasActiveRecovery={hasActiveRecovery}
            guardians={guardians}
          />
        </div>
      </div>
    </div>
  );
}
