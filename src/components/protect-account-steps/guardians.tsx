import { Guardian } from "@/components/guardian-list";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { STYLES } from "@/constants/styles";
import { cn } from "@/lib/utils";
import { ExternalLink, Info, X } from "lucide-react";

interface NewGuardian {
  nickname: string;
  address: string;
}

export default function GuardiansStep({
  guardians,
  onAddGuardian,
  onRemoveGuardian,
  onExternalLink,
  newGuardian,
  onUpdateNewGuardian,
  isAddButtonEnabled,
  isReview = false,
}: {
  guardians: Guardian[];
  onAddGuardian: () => void;
  onRemoveGuardian: (index: number) => void;
  onExternalLink: (address: string) => void;
  newGuardian: NewGuardian;
  onUpdateNewGuardian: (field: keyof NewGuardian, value: string) => void;
  isAddButtonEnabled: boolean;
  isReview?: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[1fr,2fr]">
        <div className="flex items-center">
          <label className="text-sm font-bold font-roboto-mono opacity-50">
            NICKNAME
          </label>
          {!isReview && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger tabIndex={-1} className="p-2">
                  <Info size={14} className="opacity-50" />
                </TooltipTrigger>
                <TooltipContent className="px-4 py-2 max-w-56 bg-background text-xs">
                  Nicknames are saved locally in your browser. This information
                  is private and not shared with any server.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <label className="text-sm font-bold opacity-50 font-roboto-mono ml-2">
          ADDRESS
        </label>
      </div>
      {guardians.map((guardian, index) => (
        <div key={index} className="grid grid-cols-[1fr,2fr] gap-2">
          <Input readOnly value={guardian.nickname} className={STYLES.input} />
          <div className="flex gap-2">
            <Input
              readOnly
              value={guardian.address}
              className={cn(STYLES.input, "flex-1")}
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-background group"
              onClick={() => onExternalLink(guardian.address)}
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
                onClick={() => onRemoveGuardian(index)}
                type="button"
              >
                <X size={16} className="opacity-50 hover:opacity-100" />
              </Button>
            )}
          </div>
        </div>
      ))}
      {!isReview && (
        <div className="grid grid-cols-[1fr,2fr] gap-2">
          <Input
            placeholder="Nickname..."
            value={newGuardian.nickname}
            onChange={(e) => onUpdateNewGuardian("nickname", e.target.value)}
            className={STYLES.input}
          />
          <div className="flex gap-2">
            <Input
              placeholder="Address..."
              value={newGuardian.address}
              onChange={(e) => onUpdateNewGuardian("address", e.target.value)}
              className={cn(STYLES.input, "flex-1")}
            />
            <Button
              variant="ghost"
              className="hover:bg-background text-sm"
              disabled={!isAddButtonEnabled}
              onClick={onAddGuardian}
              type="button"
            >
              Add +
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
