import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface RecoveryLinkProps {
  link: string;
}

export function RecoveryLinkSection({ link }: RecoveryLinkProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyLink = async () => {
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsCopied(false);
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
        {isCopied ? <Check size={16} /> : <Copy size={16} />}
      </div>
      <p className="text-xs text-content-foreground opacity-60 mt-2 mb-6 font-medium">
        This link is the only way to access and track this recovery process.
        Share it with guardians and save it for your records.
      </p>
    </>
  );
}
