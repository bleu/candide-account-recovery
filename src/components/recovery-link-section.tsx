import { Copy } from "lucide-react";
import PressableIcon from "./pressable-icon";
import { Input } from "./ui/input";

interface RecoveryLinkProps {
  link: string;
}

export function RecoveryLinkSection({ link }: RecoveryLinkProps) {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(link);
  };

  return (
    <>
      <h4 className="text-xs font-medium font-roboto-mono">Recovery link</h4>
      <p className="text-xs font-medium opacity-60 my-2">
        Copy the link to share with guardians or others involved in the
        recovery.
      </p>
      <div className="flex items-center gap-3 mb-6 opacity-60">
        <Input
          className="border rounded-sm text-xs bg-content-background font-medium font-roboto-mono"
          value={link}
          readOnly
        />
        <PressableIcon
          icon={Copy}
          onClick={handleCopyLink}
          size={16}
          ariaLabel="Copy recovery link"
        />
      </div>
    </>
  );
}
