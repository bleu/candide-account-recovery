import { TextSearch } from "lucide-react";
import { Suspense } from "react";
import Loading from "./loading";

export default function ManageRecovery() {
  return (
    <Suspense fallback={<Loading />}>
      <div className="flex flex-col flex-1 items-center justify-center mx-8">
        <TextSearch size={100} className="text-foreground opacity-30" />
        <h2 className="text-2xl text-primary font-bold font-roboto-mono text-center my-3">
          Manage Recovery
        </h2>
        <p className="text-lg font-roboto-mono text-center text-foreground max-w-lg">
          Search for an address to approve ongoing requests and manage guardians
          permissions.
        </p>
      </div>
    </Suspense>
  );
}
