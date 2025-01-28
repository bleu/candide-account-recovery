import { Input } from "../ui/input";
import { STYLES } from "@/constants/styles";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Copy } from "lucide-react";
import NewGuardianList from "../new-guardians-list";
import { Guardian } from "../guardian-list";

interface NewOwnersProps {
  guardians: Guardian[];
  threshold: number;
  safeAddress: string;
  onAdd: (guardian: Guardian) => void;
  onRemove: (index: number) => void;
  onExternalLink: (address: string) => void;
}

interface RecoveryQueryParams {
  safeAddress: string;
  newOwners: string[];
  newThreshold: number;
}

const baseUrl = window.location.origin;

const createFinalUrl = (params: RecoveryQueryParams): string => {
  const searchParams = new URLSearchParams();
  searchParams.append("safeAddress", params.safeAddress);
  searchParams.append("newOwners", params.newOwners.join(","));
  searchParams.append("newThreshold", params.newThreshold.toString());
  return `${baseUrl}?${searchParams.toString()}`;
};

export default function ShareLink({
  guardians,
  threshold,
  safeAddress,
  onAdd,
  onRemove,
  onExternalLink,
}: NewOwnersProps) {
  const link = createFinalUrl({
    safeAddress,
    newThreshold: threshold,
    newOwners: guardians.map((guardian) => guardian.address),
  });

  return (
    <div className="space-y-5">
      {/* Safe Address */}
      <div className="border-t pt-5" style={STYLES.textWithBorderOpacity}>
        <span className="text-lg font-bold font-roboto-mono opacity-60 ">
          Target Safe Account
        </span>
        <p className="text-base font-roboto-mono text-content-foreground mt-3">
          The address of the account that need to be recovered.
        </p>
      </div>
      {/* New Owners */}
      <div className="border-t pt-5" style={STYLES.textWithBorderOpacity}>
        <span className="text-lg font-bold font-roboto-mono opacity-60">
          Safe Account New Signers
        </span>
        <p className="text-base font-roboto-mono text-content-foreground mt-3">
          The public address of the new Safe signers.
        </p>
        <div className="mt-3">
          <NewGuardianList
            guardians={guardians}
            onAdd={onAdd}
            onRemove={onRemove}
            validationFn={(address: string) => ({
              isValid: true,
              reason: address,
            })}
            onExternalLink={onExternalLink}
            isReview={true}
          />
        </div>
      </div>
      {/* Threshold */}
      <div className="border-t pt-5" style={STYLES.textWithBorderOpacity}>
        <span className="text-lg font-bold font-roboto-mono opacity-60 ">
          Threshold
        </span>
        <p className="text-base font-roboto-mono text-content-foreground mt-3">
          Minimum {threshold} Owners to approve transactions.
        </p>
      </div>
      {/* Link */}
      <div className="border-t pt-5" style={STYLES.textWithBorderOpacity}>
        <p className="mb-3 text-lg font-bold font-roboto-mono ">
          Recovery link
        </p>
        <div className="flex items-center gap-2">
          <Input
            placeholder={link}
            className={cn(STYLES.input, "flex-1")}
            onChange={(e) => console.log(e.target.value)}
            readOnly
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-background group"
            onClick={() => navigator.clipboard.writeText(link)}
            type="button"
          >
            <Copy size={16} className="opacity-50 group-hover:opacity-100" />
          </Button>
        </div>
      </div>
    </div>
  );
}
