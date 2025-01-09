"use client";

import HomeButton from "@/components/home-button";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center">
      <div className="flex mx-12">
        <div className="flex flex-col justify-center  gap-3 flex-1 ">
          <h2 className="text-3xl font-bold text-primary font-roboto-mono">
            Welcome to Safe <br /> Account Recovery
          </h2>
          <p className="font-light text-2xl font-roboto-mono">
            Choose how you want to proceed.
          </p>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-12">
          <HomeButton
            label="OWNERS"
            title="PROTECT MY ACCOUNT"
            description="Activate Safe Account Recovery to protect your account."
            onClick={() => console.log("Protect account")}
          />
          <HomeButton
            label="ANYYONE"
            title="RECOVER AN ACCOUNT"
            description="Ask for recovery if you lost access to your account."
            onClick={() => console.log("Protect account")}
          />
          <HomeButton
            label="OWNERS AND GUARDIANS"
            title="MANAGE RECOVERY"
            description="Approve on going requests and manage guardians permissions."
            href="/manage-recovery"
            onClick={() => console.log("Protect account")}
          />
          <HomeButton
            label="OWNERS AND GUARDIANS"
            title="CANCEL RECOVERY"
            description="Cancel a request if there's no need to recover the account."
            onClick={() => console.log("Protect account")}
          />
        </div>
      </div>
    </main>
  );
}
