"use client";

import { cn } from "@/lib/utils";
import { TabsList, TabsRoot, TabsTrigger } from "@bleu.builders/ui";
import React from "react";

const baseTabStyles = cn(
  "py-2 px-4 rounded-xl",
  "text-xs font-bold text-foreground opacity-30 "
);

const tabStateStyles = cn(
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

  return (
    <div className="flex flex-col flex-1 mx-8">
      <div className="">
        <div className="max-w-6xl mx-auto">
          <TabsRoot defaultValue="management" className="mt-12">
            <TabsList className="justify-self-end bg-content-background p-1 shadow-md rounded-xl">
              <TabsTrigger
                value="management"
                className={cn(baseTabStyles, tabStateStyles)}
              >
                Recovery Management
              </TabsTrigger>
              <TabsTrigger
                value="guardians"
                className={cn(baseTabStyles, tabStateStyles)}
              >
                Account Guardians
              </TabsTrigger>
            </TabsList>
          </TabsRoot>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-1">sidebar</div>
            <div className="col-span-2">content</div>
          </div>
        </div>
      </div>
    </div>
  );
}
