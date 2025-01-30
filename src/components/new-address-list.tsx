import { useState } from "react";
import { Input } from "./ui/input";
import { STYLES } from "@/constants/styles";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { ExternalLink, X } from "lucide-react";
import { NewAddress } from "./guardian-list";

interface NewAddressListProps {
  addresses: NewAddress[];
  onAdd: (address: NewAddress) => void;
  onRemove: (index: number) => void;
  onExternalLink: (address: string) => void;
  validationFn: (address: string) => { isValid: boolean; reason: string };
  withNicknames?: boolean;
  isReview?: boolean;
  className?: string;
}
interface NewAddressState {
  address: string;
  nickname: string;
}

export default function NewAddressList({
  addresses = [],
  onAdd,
  onRemove,
  onExternalLink,
  withNicknames = false,
  isReview = false,
  className,
  validationFn,
}: NewAddressListProps) {
  const [newAddress, setNewAddress] = useState<NewAddressState>({
    address: "",
    nickname: "",
  });
  const [addressError, setAddressError] = useState<string>("");

  const handleUpdateNewAddress = (
    field: keyof NewAddressState,
    value: string
  ): void => {
    setNewAddress((prev) => ({ ...prev, [field]: value }));
    setAddressError("");
  };

  const handleAddAddress = async (): Promise<void> => {
    if (withNicknames && !newAddress.nickname) return;
    if (!newAddress.address) return;

    const { isValid, reason } = validationFn(newAddress.address);
    if (!isValid) {
      setAddressError(reason);
      return;
    }

    onAdd(newAddress);
    setNewAddress({ nickname: "", address: "" });
    setAddressError("");
  };

  const isAddButtonEnabled = (): boolean => {
    if (!newAddress.address) return false;
    if (withNicknames && !newAddress.nickname) return false;
    return true;
  };

  return (
    <div className={cn("space-y-5", className)}>
      {addresses.map((address, index) => (
        <div
          key={`${address.address}-${index}`}
          className={cn(
            withNicknames ? "grid grid-cols-[1fr,2fr] gap-2" : "flex gap-2"
          )}
        >
          {withNicknames && (
            <Input readOnly value={address.nickname} className={STYLES.input} />
          )}
          <div className="flex flex-1 gap-2 items-center">
            <Input
              readOnly
              value={address.address}
              className={cn(STYLES.input, "flex-1")}
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-background group"
              onClick={() => onExternalLink?.(address.address)}
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

      {/* Add New Address */}
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
                value={newAddress.nickname}
                onChange={(e) =>
                  handleUpdateNewAddress("nickname", e.target.value)
                }
                className={STYLES.input}
              />
            )}
            <div className="flex flex-1 gap-2 items-center">
              <Input
                placeholder="Address..."
                value={newAddress.address}
                onChange={(e) =>
                  handleUpdateNewAddress("address", e.target.value)
                }
                className={cn(STYLES.input, "flex-1")}
              />
              <Button
                variant="ghost"
                className="hover:bg-background text-sm"
                disabled={!isAddButtonEnabled()}
                onClick={handleAddAddress}
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
