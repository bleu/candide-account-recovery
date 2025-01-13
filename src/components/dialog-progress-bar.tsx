import { cn } from "@/lib/utils";

interface DialogProgressProps {
  isSelected?: boolean;
  className?: string;
}

export default function DialogProgressBar({
  isSelected,
  className,
}: DialogProgressProps) {
  return (
    <div
      className={cn(
        "h-1 bg-terciary flex-1 rounded-full",
        isSelected && "bg-primary",
        className
      )}
    />
  );
}
