"use client";

import { TabsList, TabsRoot, TabsTrigger } from "@bleu.builders/ui";
import React from "react";

export default function Dashboard() {

  return (
    <div className="flex flex-col flex-1 mx-8">
      <div className="">
        <div className="max-w-6xl mx-auto">
          <TabsRoot defaultValue="management" className="mt-12">
            <TabsList className="justify-self-end bg-content-background p-1 shadow-md rounded-xl">
              <TabsTrigger
                value="management"
                className="text-xs font-bold text-foreground opacity-30 data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground data-[state=active]:opacity-100 rounded-xl py-2 px-4"
              >
                Recovery Management
              </TabsTrigger>
              <TabsTrigger
                value="guardians"
                className="text-xs font-bold text-foreground opacity-30 data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground data-[state=active]:opacity-100 rounded-xl py-2 px-4"
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
