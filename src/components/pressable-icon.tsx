import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface PressableIconProps {
  icon: LucideIcon;
  onClick: () => void;
  size?: number;
  className?: string;
  ariaLabel?: string;
}

export default function PressableIcon({
  icon: Icon,
  onClick,
  size = 24,
  className = "",
  ariaLabel,
}: PressableIconProps) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn("p-2 hover:bg-gray-100/10", className)}
      aria-label={ariaLabel}
    >
      <Icon size={size} />
    </Button>
  );
}
