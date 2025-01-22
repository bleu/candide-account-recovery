import { cn } from "@/lib/utils";
import { GuardianRow } from "./guardian-row";
import { STYLES } from "@/constants/styles";

export interface Guardian {
  nickname: string;
  address: string;
  status?: string;
}

interface GuardianListProps {
  guardians: Guardian[];
  isNewGuardinList?: boolean;
  onRemoveGuardian?: () => void;
}

export function GuardianList({
  guardians,
  isNewGuardinList,
  onRemoveGuardian,
}: GuardianListProps) {
  return (
    <div className="space-y-6">
      <div className={cn(STYLES.label, "grid grid-cols-[1fr,3fr,1fr] gap-4")}>
        <div>NICKNAME</div>
        <div>ADDRESS</div>
        {!isNewGuardinList && <div className="text-right mr-4">APPROVAL</div>}
      </div>
      <div className="space-y-2">
        {guardians.map((guardian) => (
          <GuardianRow
            key={guardian.nickname}
            guardian={guardian}
            isNewGuardinList={isNewGuardinList}
            onRemoveGuardian={onRemoveGuardian}
          />
        ))}
      </div>
    </div>
  );
}
