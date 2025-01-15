import { cn } from "@/lib/utils";
import { GuardianRow } from "./guardian-row";
import { STYLES } from "@/constants/styles";

export interface Guardian {
  nickname: string;
  address: string;
  status: string;
}

interface GuardianListProps {
  guardians: Guardian[];
}

export function GuardianList({ guardians }: GuardianListProps) {
  return (
    <div className="space-y-6">
      <div className={cn(STYLES.label, "grid grid-cols-[1fr,3fr,1fr] gap-4")}>
        <div>NICKNAME</div>
        <div>ADDRESS</div>
        <div className="text-right mr-4">APPROVAL</div>
      </div>
      <div className="space-y-2">
        {guardians.map((guardian) => (
          <GuardianRow key={guardian.nickname} guardian={guardian} />
        ))}
      </div>
    </div>
  );
}
