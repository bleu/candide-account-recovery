import { ExternalLink } from "lucide-react";
import { Guardian } from "./guardian-list";
import PressableIcon from "./pressable-icon";

interface GuardianRowProps {
  guardian: Guardian;
}

export function GuardianRow({ guardian }: GuardianRowProps) {
  return (
    <div className="grid grid-cols-[1fr,3fr,1fr] items-center py-2 px-3 bg-background rounded-lg">
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
  );
}
