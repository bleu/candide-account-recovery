import { Copy } from "lucide-react";

interface RecoveryLinkProps {
  link: string;
}

export function RecoveryLinkSection({ link }: RecoveryLinkProps) {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(link);
  };

  return (
    <>
      <div
        className="flex items-center gap-2 text-primary cursor-pointer"
        onClick={handleCopyLink}
      >
        <h4 className="text-xs font-medium font-roboto-mono underline">
          Copy Recovery link
        </h4>
        <Copy size={16} />
      </div>
      <p className="text-xs text-content-foreground opacity-60 mt-2 mb-6 font-medium">
        This link is the only way to access and track this recovery process.
        Share it with guardians and save it for your records.
      </p>
    </>
  );
}
