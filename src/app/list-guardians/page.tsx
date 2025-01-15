"use client";

import { useAccountGuardians } from "@/hooks/useAccountGuardians";

export default function Page() {
  const { data: guardians, error, isLoading } = useAccountGuardians();

  if (error) return <div className="w-full h-full">{error.message}</div>;

  if (isLoading || !guardians)
    return <div className="w-full h-full">Loading...</div>;

  if (guardians.length === 0)
    return (
      <div className="w-full h-full">
        <p>No guardians found</p>
      </div>
    );

  return (
    <div className="w-full h-full">
      Your guardians:
      <br />
      <ul>
        {guardians.map((guardian, index) => (
          <li key={index}>{guardian}</li>
        ))}
      </ul>
    </div>
  );
}
