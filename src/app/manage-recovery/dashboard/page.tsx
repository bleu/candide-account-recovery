"use client";

import EmptyActiveRecovery from "@/components/empty-active-recovery";
import RecoveryStatus from "@/components/recovery-status";
import Button from "@/components/ui/button";
import PressableIcon from "@/components/ui/pressable-icon";
import { cn } from "@/lib/utils";
import { Input, TabsList, TabsRoot, TabsTrigger } from "@bleu.builders/ui";
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

const textWithBorderStyle =
  "border px-3 opacity-60 text-sm font-medium font-roboto-mono rounded-s";

const labelStyle = "text-xs font-roboto-mono font-bold";

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
  const thresholdAchieved = true;
  const delayPeriodStarted = true;
  const delayPeriodEnded = false;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(recoveryLink);
  };

  return (
    <div className="flex flex-col flex-1 mx-8">
      <div className="max-w-6xl mx-auto">
        <TabsRoot defaultValue="management" className="flex justify-end ">
          <TabsList className="bg-content-background p-1 shadow-md rounded-xl mt-12 mb-3">
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
            {hasActiveRecovery && (
              <RecoveryStatus
                delayPeriodEnded={delayPeriodEnded}
                thresholdAchieved={thresholdAchieved}
                delayPeriodStarted={delayPeriodStarted}
                remainingTime="2d 23h 59min"
              />
            )}
            <h3 className="mb-2 font-bold text-sm font-roboto-mono">
              SAFE ACCOUNT
            </h3>
            <div
              style={{ borderColor: "rgba(255, 255, 255, 0.08)" }}
              className="flex items-center gap-3 opacity-60 border-b border-opacity-30 pb-2 mb-6"
            >
              <p className="text-2xl font-roboto-mono">0xabc.eth</p>
              <ExternalLink />
            </div>
            {hasActiveRecovery && (
              <>
                <h4 className="text-xs font-medium font-roboto-mono">
                  Recovery link
                </h4>
                <p className="text-xs font-medium opacity-60 my-2">
                  Copy the link to share with guardians or others involved in
                  the recovery.
                </p>
                <div className="flex items-center gap-3 mb-6 opacity-60">
                  <Input
                    className="border rounded-sm text-xs bg-content-background font-medium font-roboto-mono"
                    value={recoveryLink}
                    readOnly
                  />
                  <PressableIcon
                    icon={Copy}
                    onClick={handleCopyLink}
                    size={16}
                    ariaLabel="Copy recovery link"
                  />
                </div>
                <h4 className="text-xs font-medium font-roboto-mono">
                  Cancel Request
                </h4>
                <p className="text-xs font-medium opacity-60 my-2">
                  Account owners can cancel this request at any time.
                </p>
                <Button className="font-bold text-xs font-roboto-mono rounded-xl">
                  Cancel
                </Button>
              </>
            )}
          </div>
          <div className="col-span-2">
            <div className="p-6 bg-content-background shadow-lg rounded-xl">
              <h3 className="text-lg font-bold font-roboto-mono text-primary">
                Account Recovery
              </h3>
              <div className="flex gap-2 my-6">
                <div className="flex flex-col gap-1">
                  <p className={labelStyle}>DELAY PERIOD</p>
                  <span
                    style={{ borderColor: "rgba(255, 255, 255, 0.08)" }}
                    className={textWithBorderStyle}
                  >
                    3-day period not started.
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <p className={labelStyle}>THRESHOLD</p>
                  <span
                    style={{ borderColor: "rgba(255, 255, 255, 0.08)" }}
                    className={textWithBorderStyle}
                  >
                    2 of 2 Guardians
                  </span>
                </div>
              </div>
              {hasActiveRecovery ? (
                <>
                  <p className={labelStyle}>SAFE SIGNERS</p>
                  {guardians.map((guardian) => (
                    <div
                      key={guardian.nickname}
                      className={cn(
                        textWithBorderStyle,
                        "inline-flex items-center gap-2"
                      )}
                      style={{ borderColor: "rgba(255, 255, 255, 0.08)" }}
                    >
                      <span>{guardian.address}</span>
                      <ExternalLink size={14} />
                    </div>
                  ))}
                  <h4 className="my-6 text-primary font-roboto-mono text-sm">
                    GUARDIANS APPROVAL
                  </h4>
                  <div className="space-y-6">
                    <div
                      className={cn(
                        labelStyle,
                        "grid grid-cols-[1fr,3fr,1fr] gap-4"
                      )}
                    >
                      <div>NICKNAME</div>
                      <div>ADDRESS</div>
                      <div className="text-right mr-4">APPROVAL</div>
                    </div>
                    <div className="space-y-2">
                      {guardians.map((guardian) => (
                        <div
                          key={guardian.nickname}
                          className="grid grid-cols-[1fr,3fr,1fr] items-center py-2 px-3 bg-background rounded-lg"
                        >
                          <div className="text-xs text-foreground opacity-60 font-medium font-roboto-mono">
                            {guardian.nickname}
                          </div>

                          <div className="flex items-center gap-2">
                            <code className="text-xs text-foreground opacity-60 font-medium font-roboto-mono">
                              {guardian.address}
                            </code>
                            <PressableIcon
                              icon={ExternalLink}
                              onClick={() => console.log("link")}
                              size={14}
                              className="opacity-60 hover:opacity-100"
                            />
                          </div>

                          <div className="flex justify-end">
                            <span className="px-4 py-1 bg-terciary text-terciary-foreground rounded-md text-xs">
                              {guardian.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end mt-4 mb-2 gap-2">
                    <Button className="text-xs font-roboto-mono font-bold px-3 py-2 rounded-xl">
                      Start Delay Period
                    </Button>
                    <Button className="text-xs font-roboto-mono font-bold px-3 py-2 rounded-xl">
                      Approve Recovery
                    </Button>
                  </div>
                  <span className="text-xs flex justify-end text-[10px] opacity-60">
                    Only Guardians can approve this recovery request.
                  </span>
                </>
              ) : (
                <EmptyActiveRecovery />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
