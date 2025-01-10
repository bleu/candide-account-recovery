"use client";
import Button from "@/components/ui/button";

export default function ProtectAccount() {
  const isWalletConnected = false;

  return (
    <div className="flex flex-1 items-center justify-center mx-8">
      {isWalletConnected ? (
        <div className="max-w-2xl text-center">
          <h2 className="text-2xl text-primary font-bold font-roboto-mono text-center ">
            Connect the Account you want to protect.{" "}
          </h2>
          <p className="text-lg font-roboto-mono text-center text-foreground mb-6 mt-4">
            The recovery module helps you regain control of your account if your
            key is lost or compromised by relying on trusted guardians you add
            to your account.
          </p>
          <Button className="text-lg font-bold font-roboto-mono px-4 py-2 rounded-xl">
            Connect wallet
          </Button>
        </div>
      ) : (
        <div>Wallet connected</div>
      )}
    </div>
  );
}
