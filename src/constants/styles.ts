import { cn } from "@/lib/utils";

export const STYLES = {
  textWithBorder:
    "border px-3 opacity-60 text-sm font-medium font-roboto-mono rounded-s",
  label: "text-xs font-roboto-mono font-bold",
  textWithBorderOpacity: { borderColor: "rgba(255, 255, 255, 0.08)" },
  baseTab: cn(
    "py-2 px-4 rounded-xl",
    "text-xs font-bold text-foreground opacity-30"
  ),
  tabState: cn(
    "data-[state=active]:bg-secondary",
    "data-[state=active]:text-secondary-foreground",
    "data-[state=active]:opacity-100"
  ),
} as const;
