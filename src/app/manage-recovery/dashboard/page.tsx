"use client";

import { cn } from "@/lib/utils";
import {
  Button,
  Input,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from "@bleu.builders/ui";
import { Copy, ExternalLink, Info } from "lucide-react";
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
            <div className="col-span-1">
              <div className="flex items-center justify-between gap-2 flex-1 bg-terciary text-terciary-foreground text-xs font-roboto-mono rounded-lg py-2 px-4">
                <div>
                  <p className="font-bold mb-1">Recovery Ongoing</p>
                  <p className="font-medium">Delay period not started.</p>
                </div>
                <Info size={21} />
              </div>
              <h3 className="mt-6 mb-2 font-bold text-sm font-roboto-mono">
                SAFE ACCOUNT
              </h3>
              <div
                style={{ borderColor: "rgba(255, 255, 255, 0.08)" }}
                className="flex items-center gap-3 opacity-60 border-b border-opacity-30 pb-2 mb-6"
              >
                <p className="text-2xl font-roboto-mono">0xabc.eth</p>
                <ExternalLink />
              </div>
              <h4 className="text-xs font-medium font-roboto-mono">
                Recovery link
              </h4>
              <p className="text-xs font-medium opacity-60 my-2">
                Copy the link to share with guardians or others involved in the
                recovery.
              </p>
              <div className="flex items-center gap-3 mb-6">
                {/* finish this style */}
                <Input
                  style={{ borderColor: "rgba(255, 255, 255, 0.60)" }}
                  className="border rounded-sm text-xs"
                />
                <Copy size={24} />
              </div>
              <h4 className="text-xs font-medium font-roboto-mono">
                Cancel Request
              </h4>
              <p className="text-xs font-medium opacity-60 my-2">
                Account owners can cancel this request at any time.
              </p>
              <Button className="bg-primary text-primary-foreground hover:bg-terciary hover:text-primary font-bold text-xs font-roboto-mono rounded-xl">
                Cancel
              </Button>
            </div>
            <div className="col-span-2">content</div>
          </div>
        </div>
      </div>
    </div>
  );
}
