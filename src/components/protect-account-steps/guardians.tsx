import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import NewGuardianList from "../new-guardians-list";
import { Guardian } from "../guardian-list";

interface GuardiansStepProps {
  guardians: Guardian[];
  onAddGuardian: (guardian: Guardian) => void;
  onRemoveGuardian: (index: number) => void;
  onExternalLink: (address: string) => void;
  isReview?: boolean;
}

export default function GuardiansStep({
  guardians,
  onAddGuardian,
  onRemoveGuardian,
  onExternalLink,
  isReview = false,
}: GuardiansStepProps) {
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
      <NewGuardianList
        guardians={guardians}
        onAdd={onAddGuardian}
        onRemove={onRemoveGuardian}
        onExternalLink={onExternalLink}
        withNicknames={true}
        isReview={isReview}
      />
    </div>
  );
}
