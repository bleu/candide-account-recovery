"use client";

import { useGuardians } from "@/hooks/useGuardians";
import { useOwners } from "@/hooks/useOwners";

export default function Page() {
  const { guardians, error: guardiansError } = useGuardians();
  const { owners, error: ownersError } = useOwners();

  if (guardiansError || ownersError) {
    return (
      <div className="w-full h-full">
        {guardiansError?.message || ownersError?.message}
      </div>
    );
  }

  if (!guardians || !owners) {
    return <div className="w-full h-full">Loading...</div>;
  }

  console.log({ guardians, owners });

  return (
    <div className="w-full h-full grid grid-cols-2 gap-8">
      <div>
        <h2 className="text-xl font-bold mb-4">Owners</h2>
        {owners.length === 0 ? (
          <p>No owners found</p>
        ) : (
          <ul className="space-y-2">
            {owners.map((owner, index) => (
              <li key={`owner-${index}`} className="font-mono">
                {owner}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Guardians</h2>
        {guardians.length === 0 ? (
          <p>No guardians found</p>
        ) : (
          <ul className="space-y-2">
            {guardians.map((guardian, index) => (
              <li key={`guardian-${index}`} className="font-mono">
                {guardian}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
