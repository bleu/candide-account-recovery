import { cn } from "@/lib/utils";

export const STYLES = {
  textWithBorder:
    "border px-3 opacity-60 text-sm font-medium font-roboto-mono rounded-s",
  label: "text-xs font-roboto-mono font-bold",
  textWithBorderOpacity: {
    borderColor: "rgba(255, 255, 255, 0.08)",
    padding: "4px",
  },
  baseTab: cn(
    "py-2 px-4 rounded-xl",
    "text-xs font-bold text-foreground opacity-30"
  ),
  input: "bg-background text-sm border-none focus:ring-primary",
  modalSectionTitle:
    "text-base font-bold font-roboto-mono text-content-foreground",
  modalSectionDescription:
    "text-sm font-roboto-mono text-content-foreground opacity-60",
  textError: "text-alert font-roboto-mono font-medium",
} as const;
