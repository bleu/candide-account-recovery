import { useState } from "react";
import { Input } from "./ui/input";
import { STYLES } from "@/constants/styles";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { ExternalLink, X } from "lucide-react";
import { useValidateNewGuardian } from "@/hooks/useValidateNewGuardian";
import { Guardian } from "./guardian-list";

interface NewGuardianListProps {
  guardians: Guardian[];
  onAdd: (guardian: Guardian) => void;
  onRemove: (index: number) => void;
  onExternalLink: (address: string) => void;
  withNicknames?: boolean;
  isReview?: boolean;
  className?: string;
}
interface NewGuardianState {
  address: string;
  nickname: string;
}

export default function NewGuardianList({
  guardians = [],
  onAdd,
  onRemove,
  onExternalLink,
  withNicknames = false,
  isReview = false,
  className,
}: NewGuardianListProps) {
  const validateNewGuardian = useValidateNewGuardian();

  const [newGuardian, setNewGuardian] = useState<NewGuardianState>({
    address: "",
    nickname: "",
  });
  const [addressError, setAddressError] = useState<string>("");

  const handleUpdateNewGuardian = (
    field: keyof NewGuardianState,
    value: string
  ): void => {
    setNewGuardian((prev) => ({ ...prev, [field]: value }));
    setAddressError("");
  };

  const handleAddGuardian = async (): Promise<void> => {
    if (withNicknames && !newGuardian.nickname) return;
    if (!newGuardian.address) return;

    const { isValid, reason } = validateNewGuardian(
      newGuardian.address,
      guardians.map((guardian) => guardian.address)
    );
    if (!isValid) {
      setAddressError(reason);
      return;
    }

    onAdd(newGuardian);
    setNewGuardian({ nickname: "", address: "" });
    setAddressError("");
  };

  const isAddButtonEnabled = (): boolean => {
    if (!newGuardian.address) return false;
    if (withNicknames && !newGuardian.nickname) return false;
    return true;
  };

  return (
    <div className={cn("space-y-5", className)}>
      {guardians.map((guardian, index) => (
        <div
          key={`${guardian.address}-${index}`}
          className={cn(
            withNicknames ? "grid grid-cols-[1fr,2fr] gap-2" : "flex gap-2"
          )}
        >
          {withNicknames && (
            <Input
              readOnly
              value={guardian.nickname}
              className={STYLES.input}
            />
          )}
          <div className="flex flex-1 gap-2">
            <Input
              readOnly
              value={guardian.address}
              className={cn(STYLES.input, "flex-1")}
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-background group"
              onClick={() => onExternalLink?.(guardian.address)}
              type="button"
            >
              <ExternalLink
                size={16}
                className="opacity-50 group-hover:opacity-100"
              />
            </Button>
            {!isReview && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-background"
                onClick={() => onRemove(index)}
                type="button"
              >
                <X size={16} className="opacity-50 hover:opacity-100" />
              </Button>
            )}
          </div>
        </div>
      ))}

      {/* Add New Guardian */}
      {!isReview && (
        <div>
          <div
            className={cn(
              withNicknames ? "grid grid-cols-[1fr,2fr] gap-2" : "flex gap-2"
            )}
          >
            {withNicknames && (
              <Input
                placeholder="Nickname..."
                value={newGuardian.nickname}
                onChange={(e) =>
                  handleUpdateNewGuardian("nickname", e.target.value)
                }
                className={STYLES.input}
              />
            )}
            <div className="flex flex-1 gap-2">
              <Input
                placeholder="Address..."
                value={newGuardian.address}
                onChange={(e) =>
                  handleUpdateNewGuardian("address", e.target.value)
                }
                className={cn(STYLES.input, "flex-1")}
              />
              <Button
                variant="ghost"
                className="hover:bg-background text-sm"
                disabled={!isAddButtonEnabled()}
                onClick={handleAddGuardian}
                type="button"
              >
                Add +
              </Button>
            </div>
          </div>
          {addressError && (
            <p className="text-alert font-roboto-mono font-medium text-sm mt-2">
              {addressError}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
